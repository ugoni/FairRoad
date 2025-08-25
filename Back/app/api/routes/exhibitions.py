from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.exhibition import Exhibition
from app.models.user import User
from app.models.association import user_bookmarks, user_likes, exhibition_genre_tags
from app.models.review import Tag
from app.models.calendar import CalendarEvent
from app.schemas.exhibition import ExhibitionOut, LikeBookmarkResponse, MapMarker
from app.utils.security import get_current_user

router = APIRouter(prefix="/exhibitions", tags=["exhibitions"])


@router.get(
    "",
    response_model=list[ExhibitionOut],
    summary="인기 전시 목록",
    description="평균 평점과 평점 수 기준으로 인기 전시를 최대 `limit`개까지 내림차순 정렬하여 반환합니다.",
)
async def list_popular(limit: int = 20, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Exhibition).order_by(Exhibition.average_rating.desc(), Exhibition.rating_count.desc()).limit(limit)
    )
    return result.scalars().all()


@router.get(
    "/{exhibition_id}",
    response_model=ExhibitionOut,
    summary="전시 상세",
    description="전시 ID로 상세 정보를 조회합니다. 존재하지 않으면 404를 반환합니다.",
)
async def get_detail(exhibition_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Exhibition).where(Exhibition.id == exhibition_id))
    obj = result.scalar_one_or_none()
    if obj is None:
        raise HTTPException(status_code=404, detail="Exhibition not found")
    return obj


@router.get(
    "/markers/all",
    response_model=list[MapMarker],
    summary="지도 마커 전시 목록",
    description="위도/경도가 있는 전시의 간단한 마커 정보를 평균 평점 순으로 반환합니다.",
)
async def map_markers(limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Exhibition.id, Exhibition.name, Exhibition.latitude, Exhibition.longitude, Exhibition.average_rating)
        .where(Exhibition.latitude.isnot(None), Exhibition.longitude.isnot(None))
        .order_by(Exhibition.average_rating.desc())
        .limit(limit)
    )
    rows = result.all()
    return [
        MapMarker(
            id=row.id,
            name=row.name,
            latitude=float(row.latitude),
            longitude=float(row.longitude),
            average_rating=float(row.average_rating or 0.0),
        )
        for row in rows
    ]


@router.post(
    "/{exhibition_id}/like",
    response_model=LikeBookmarkResponse,
    summary="전시 좋아요",
    description="현재 사용자가 특정 전시에 좋아요를 추가합니다. 중복 추가 시 무시됩니다.",
)
async def like_exhibition(exhibition_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = pg_insert(user_likes).values(user_id=current_user.id, exhibition_id=exhibition_id)
    do_nothing = stmt.on_conflict_do_nothing(index_elements=[user_likes.c.user_id, user_likes.c.exhibition_id])
    await db.execute(do_nothing)
    # update count (optional): we'll compute likes count via association table if needed
    await db.commit()
    return LikeBookmarkResponse(success=True, liked=True)


@router.delete(
    "/{exhibition_id}/like",
    response_model=LikeBookmarkResponse,
    summary="전시 좋아요 취소",
    description="현재 사용자가 특정 전시에 눌렀던 좋아요를 취소합니다.",
)
async def unlike_exhibition(exhibition_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    await db.execute(user_likes.delete().where(
        (user_likes.c.user_id == current_user.id) & (user_likes.c.exhibition_id == exhibition_id)
    ))
    await db.commit()
    return LikeBookmarkResponse(success=True, liked=False)


@router.post(
    "/{exhibition_id}/bookmark",
    response_model=LikeBookmarkResponse,
    summary="전시 북마크",
    description="현재 사용자가 특정 전시를 북마크에 추가합니다. 중복 추가 시 무시되며, 북마크 시 개인 캘린더에 해당 전시 일정이 자동 생성됩니다.",
)
async def bookmark_exhibition(exhibition_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 전시 존재 확인
    result = await db.execute(select(Exhibition).where(Exhibition.id == exhibition_id))
    ex = result.scalar_one_or_none()
    if ex is None:
        raise HTTPException(status_code=404, detail="Exhibition not found")

    # 북마크 upsert
    stmt = pg_insert(user_bookmarks).values(user_id=current_user.id, exhibition_id=exhibition_id)
    do_nothing = stmt.on_conflict_do_nothing(index_elements=[user_bookmarks.c.user_id, user_bookmarks.c.exhibition_id])
    await db.execute(do_nothing)

    # 캘린더 일정 자동 생성(중복 방지: 동일 제목/시작일 기준)
    existing_event = await db.execute(
        select(CalendarEvent).where(
            (CalendarEvent.user_id == current_user.id)
            & (CalendarEvent.title == ex.name)
            & (CalendarEvent.start_date == ex.start_date)
        )
    )
    if existing_event.scalar_one_or_none() is None:
        event = CalendarEvent(
            user_id=current_user.id,
            title=ex.name,
            start_date=ex.start_date or ex.end_date,
            end_date=ex.end_date or ex.start_date or ex.start_date,
            location=ex.address,
            url=ex.official_url,
            is_all_day=True,
        )
        db.add(event)

    await db.commit()
    return LikeBookmarkResponse(success=True, bookmarked=True)


@router.delete(
    "/{exhibition_id}/bookmark",
    response_model=LikeBookmarkResponse,
    summary="전시 북마크 취소",
    description="현재 사용자가 특정 전시의 북마크를 제거합니다.",
)
async def unbookmark_exhibition(exhibition_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    await db.execute(user_bookmarks.delete().where(
        (user_bookmarks.c.user_id == current_user.id) & (user_bookmarks.c.exhibition_id == exhibition_id)
    ))
    await db.commit()
    return LikeBookmarkResponse(success=True, bookmarked=False)


@router.get(
    "/search",
    response_model=list[ExhibitionOut],
    summary="전시 검색",
    description="전시 이름/설명/주소에 대해 부분 일치 검색을 수행하고, 지역 필터를 적용하여 결과를 시작일 오름차순으로 반환합니다.",
)
async def search(q: str | None = None, region: str | None = None, db: AsyncSession = Depends(get_db)):
    stmt = select(Exhibition)
    if q:
        pattern = f"%{q}%"
        stmt = stmt.where(Exhibition.name.ilike(pattern) | Exhibition.description.ilike(pattern) | Exhibition.address.ilike(pattern))
    if region:
        stmt = stmt.where(Exhibition.region == region)
    stmt = stmt.order_by(Exhibition.start_date.asc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.put(
    "/{exhibition_id}/genres",
    response_model=dict,
    summary="전시 장르 태그 설정",
    description="전시에 연결할 장르 태그 이름 배열을 받아 저장합니다. 태그가 없으면 생성되며, 태그 타입은 'genre'로 고정됩니다.",
)
async def set_exhibition_genres(exhibition_id: int, names: list[str], db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Exhibition).where(Exhibition.id == exhibition_id))
    ex = result.scalar_one_or_none()
    if ex is None:
        raise HTTPException(status_code=404, detail="Exhibition not found")

    normalized = [n.strip().lower() for n in names if n and n.strip()]
    genre_objs: list[Tag] = []
    for name in normalized:
        res = await db.execute(select(Tag).where((Tag.name == name) & (Tag.tag_type == "genre")))
        tag = res.scalar_one_or_none()
        if tag is None:
            tag = Tag(name=name, tag_type="genre")
            db.add(tag)
            await db.flush()
        genre_objs.append(tag)

    ex.genre_tags = genre_objs
    await db.commit()
    await db.refresh(ex)
    return {"id": ex.id, "genres": [t.name for t in ex.genre_tags]}
