from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.association import user_follows, user_likes
from app.models.review import Review
from app.models.user import User
from app.utils.security import get_current_user

router = APIRouter(prefix="/social", tags=["social"])


@router.post(
    "/users/{user_id}/follow",
    summary="사용자 팔로우",
    description="현재 사용자가 지정한 사용자ID를 팔로우합니다. 자기 자신은 팔로우할 수 없습니다.",
)
async def follow_user(user_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.id == user_id:
        return {"success": False, "reason": "cannot follow yourself"}
    await db.execute(user_follows.insert().values(follower_id=current_user.id, following_id=user_id).prefix_with("ON CONFLICT DO NOTHING"))
    await db.commit()
    return {"success": True}


@router.delete(
    "/users/{user_id}/follow",
    summary="사용자 언팔로우",
    description="현재 사용자가 지정한 사용자ID에 대한 팔로우를 해제합니다.",
)
async def unfollow_user(user_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    await db.execute(user_follows.delete().where(
        (user_follows.c.follower_id == current_user.id) & (user_follows.c.following_id == user_id)
    ))
    await db.commit()
    return {"success": True}


@router.get(
    "/feed",
    summary="팔로잉 피드",
    description="내가 팔로우한 사용자들이 작성한 최신 리뷰를 간단한 카드 형태의 목록으로 반환합니다.",
)
async def feed(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # very simple feed: latest reviews by following users, plus likes
    following_ids_stmt = select(user_follows.c.following_id).where(user_follows.c.follower_id == current_user.id)
    following_ids = [row[0] for row in (await db.execute(following_ids_stmt)).all()]
    if not following_ids:
        return []

    reviews_stmt = select(Review).where(Review.user_id.in_(following_ids)).order_by(Review.created_at.desc()).limit(50)
    reviews = (await db.execute(reviews_stmt)).scalars().all()

    # likes are not timestamped in association table; skipping ordering. In real impl, add created_at column.
    return [
        {
            "type": "review",
            "review_id": r.id,
            "user_id": r.user_id,
            "exhibition_id": r.exhibition_id,
            "rating": r.rating,
            "created_at": r.created_at,
        }
        for r in reviews
    ]
