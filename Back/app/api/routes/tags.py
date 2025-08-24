from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.review import Tag


router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("/", response_model=list[str], summary="태그 목록 조회", description="태그 이름 목록을 반환합니다. type(genre|preference), q(부분 검색), limit를 지원합니다.")
async def list_tags(
    type: str | None = Query(default=None, pattern="^(genre|preference)$"),
    q: str | None = None,
    limit: int = Query(default=50, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Tag)
    if type is not None:
        stmt = stmt.where(Tag.tag_type == type)
    if q:
        pattern = f"%{q.strip().lower()}%"
        stmt = stmt.where(Tag.name.ilike(pattern))
    stmt = stmt.order_by(Tag.name.asc()).limit(limit)

    rows = (await db.execute(stmt)).scalars().all()
    return [t.name for t in rows]


@router.get("/groups", summary="태그를 타입별로 그룹핑하여 조회", description="genre/preference로 그룹핑된 태그 이름 목록을 반환합니다.")
async def grouped_tags(db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(Tag))).scalars().all()
    genre = sorted([t.name for t in rows if t.tag_type == "genre"])
    preference = sorted([t.name for t in rows if t.tag_type == "preference"])
    return {"genre": genre, "preference": preference}


