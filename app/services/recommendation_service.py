from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.exhibition import Exhibition
from app.models.user import User


async def recommend_for_user(db: AsyncSession, user: User, limit: int = 10) -> list[Exhibition]:
    # Very naive: just return top rated for now. Later: filter by user's topics/regions.
    result = await db.execute(
        select(Exhibition).order_by(Exhibition.average_rating.desc(), Exhibition.rating_count.desc()).limit(limit)
    )
    return result.scalars().all()
