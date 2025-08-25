from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.calendar import CalendarEvent
from app.models.exhibition import Exhibition
from app.schemas.calendar import CalendarEventCreate, CalendarEventOut
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.get(
    "",
    response_model=list[CalendarEventOut],
    summary="내 캘린더 이벤트 목록",
    description="현재 사용자에게 속한 모든 캘린더 일정을 시작일 오름차순으로 반환합니다.",
)
async def list_events(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(CalendarEvent).where(CalendarEvent.user_id == current_user.id).order_by(CalendarEvent.start_date.asc()))
    return result.scalars().all()


@router.post(
    "",
    response_model=CalendarEventOut,
    status_code=201,
    summary="캘린더 이벤트 생성",
    description="제목, 기간, 장소, URL, 메모 등의 정보를 받아 개인 캘린더 일정으로 저장합니다.",
)
async def add_event(payload: CalendarEventCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    event = CalendarEvent(
        user_id=current_user.id,
        title=payload.title,
        start_date=payload.start_date,
        end_date=payload.end_date,
        location=payload.location,
        url=payload.url,
        memo=payload.memo,
        is_all_day=payload.is_all_day,
    )
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event


@router.post(
    "/reserve/{exhibition_id}",
    response_model=CalendarEventOut,
    status_code=201,
    summary="전시 예약(일정 추가)",
    description="전시 상세에서 일정 추가를 눌렀을 때, 전시 기간/장소/공식 URL을 기반으로 개인 캘린더에 일정을 생성합니다.",
)
async def reserve_exhibition(exhibition_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Exhibition).where(Exhibition.id == exhibition_id))
    ex = result.scalar_one_or_none()
    if ex is None:
        raise HTTPException(status_code=404, detail="Exhibition not found")

    event = CalendarEvent(
        user_id=current_user.id,
        title=ex.name,
        start_date=ex.start_date,
        end_date=ex.end_date,
        location=ex.address,
        url=ex.official_url,
        is_all_day=True,
    )
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event
