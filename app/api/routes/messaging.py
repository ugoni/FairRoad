from datetime import datetime, timezone

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio
import json
import redis.asyncio as aioredis

from app.core.config import settings
from app.db.session import get_db
from app.models.message import Conversation, ConversationParticipant, Message
from app.models.user import User
from app.utils.security import get_current_user


router = APIRouter(prefix="/messaging", tags=["messaging"])


async def get_redis() -> aioredis.Redis:
    return aioredis.from_url(settings.redis_url, decode_responses=True)


@router.post("/conversations", summary="대화방 생성", description="참가자 사용자ID 배열을 받아 1:1 또는 그룹 대화방을 생성합니다.")
async def create_conversation(participant_ids: list[int], db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 현재 사용자 포함 보장
    user_ids = list({*participant_ids, current_user.id})
    is_group = len(user_ids) > 2
    conv = Conversation(is_group=is_group, created_at=datetime.now(tz=timezone.utc))
    db.add(conv)
    await db.flush()
    for uid in user_ids:
        db.add(ConversationParticipant(conversation_id=conv.id, user_id=uid, joined_at=datetime.now(tz=timezone.utc)))
    await db.commit()
    await db.refresh(conv)
    return {"id": conv.id, "is_group": conv.is_group, "participants": user_ids}


@router.websocket("/ws/{conversation_id}")
async def websocket_endpoint(websocket: WebSocket, conversation_id: int, db: AsyncSession = Depends(get_db)):
    await websocket.accept()
    redis = await get_redis()
    pubsub = redis.pubsub()
    channel = f"conv:{conversation_id}"
    await pubsub.subscribe(channel)

    async def receiver():
        try:
            async for message in pubsub.listen():
                if message.get("type") == "message":
                    await websocket.send_text(message["data"])
        except asyncio.CancelledError:
            pass

    task = asyncio.create_task(receiver())
    try:
        while True:
            text = await websocket.receive_text()
            # 매우 단순한 메시지: sender_id와 content만 전달된다고 가정
            payload = json.loads(text)
            sender_id = int(payload.get("sender_id"))
            content = str(payload.get("content", "")).strip()
            if not content:
                continue
            msg = Message(
                conversation_id=conversation_id,
                sender_id=sender_id,
                content=content,
                created_at=datetime.now(tz=timezone.utc),
            )
            db.add(msg)
            await db.commit()
            data = json.dumps({"conversation_id": conversation_id, "sender_id": sender_id, "content": content, "created_at": msg.created_at.isoformat()})
            await redis.publish(channel, data)
    except WebSocketDisconnect:
        pass
    finally:
        task.cancel()
        await pubsub.unsubscribe(channel)
        await pubsub.close()

