from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.exhibition import Exhibition
from app.models.review import Review, Tag

router = APIRouter(prefix="/search", tags=["search"])


@router.get(
    "/all",
    summary="전역 검색",
    description="전시 이름/설명/주소와 리뷰 내용을 대상으로 전체 검색을 수행하여 간단한 요약 리스트를 반환합니다.",
)
async def global_search(q: str, db: AsyncSession = Depends(get_db)):
    pattern = f"%{q}%"
    ex_stmt = select(Exhibition).where(Exhibition.name.ilike(pattern) | Exhibition.description.ilike(pattern) | Exhibition.address.ilike(pattern))
    rev_stmt = select(Review).where(Review.content.ilike(pattern))

    exs = (await db.execute(ex_stmt)).scalars().all()
    revs = (await db.execute(rev_stmt)).scalars().all()

    return {
        "exhibitions": [{"id": e.id, "name": e.name, "poster_url": e.poster_url} for e in exs],
        "reviews": [{"id": r.id, "exhibition_id": r.exhibition_id, "rating": r.rating} for r in revs],
    }


@router.get(
    "/hashtags",
    summary="해시태그 검색",
    description="태그 이름으로 리뷰를 조회합니다. 없으면 빈 배열을 반환합니다.",
)
async def hashtag_search(q: str, db: AsyncSession = Depends(get_db)):
    tag = (await db.execute(select(Tag).where(Tag.name == q.strip().lower()))).scalar_one_or_none()
    if tag is None:
        return []
    return [{"review_id": r.id, "exhibition_id": r.exhibition_id, "rating": r.rating} for r in tag.reviews]
