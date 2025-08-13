from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.exhibition import Exhibition
from app.models.review import Review, Tag
from app.schemas.review import ReviewCreate, ReviewOut
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get(
    "/exhibitions/{exhibition_id}",
    response_model=list[ReviewOut],
    summary="전시 리뷰 목록",
    description="특정 전시의 최신 리뷰들을 작성 시각 내림차순으로 반환합니다. 각 리뷰의 태그 이름도 함께 제공합니다.",
)
async def list_reviews(exhibition_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Review).where(Review.exhibition_id == exhibition_id).order_by(Review.created_at.desc()))
    reviews = result.scalars().all()
    # load tags names
    out: list[ReviewOut] = []
    for r in reviews:
        out.append(ReviewOut(
            id=r.id,
            user_id=r.user_id,
            exhibition_id=r.exhibition_id,
            rating=r.rating,
            content=r.content,
            images=r.images,
            created_at=r.created_at,
            tags=[t.name for t in r.tags],
        ))
    return out


@router.post(
    "/exhibitions/{exhibition_id}",
    response_model=ReviewOut,
    status_code=201,
    summary="리뷰 작성",
    description="지정한 전시에 대해 평점, 내용, 이미지, 태그를 포함한 리뷰를 작성합니다. 성공하면 생성된 리뷰와 태그명을 반환합니다.",
)
async def create_review(exhibition_id: int, payload: ReviewCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    exists = await db.execute(select(Exhibition).where(Exhibition.id == exhibition_id))
    exhibition = exists.scalar_one_or_none()
    if exhibition is None:
        raise HTTPException(status_code=404, detail="Exhibition not found")

    review = Review(
        user_id=current_user.id,
        exhibition_id=exhibition_id,
        rating=payload.rating,
        content=payload.content,
        images=payload.images or [],
        created_at=datetime.now(tz=timezone.utc),
    )

    # tags
    tag_objs = []
    if payload.tags:
        for name in payload.tags:
            name_norm = name.strip().lower()
            res = await db.execute(select(Tag).where(Tag.name == name_norm))
            tag = res.scalar_one_or_none()
            if tag is None:
                tag = Tag(name=name_norm)
                db.add(tag)
                await db.flush()
            tag_objs.append(tag)
    review.tags = tag_objs

    db.add(review)

    # update exhibition rating denorm
    # new_avg = (avg*n + rating) / (n + 1)
    new_count = (exhibition.rating_count or 0) + 1
    new_avg = ((exhibition.average_rating or 0) * (new_count - 1) + payload.rating) / new_count
    exhibition.rating_count = new_count
    exhibition.average_rating = new_avg

    await db.commit()
    await db.refresh(review)

    return ReviewOut(
        id=review.id,
        user_id=review.user_id,
        exhibition_id=review.exhibition_id,
        rating=review.rating,
        content=review.content,
        images=review.images,
        created_at=review.created_at,
        tags=[t.name for t in review.tags],
    )
