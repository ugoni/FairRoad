from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.models.exhibition import Exhibition
from app.models.review import Tag
from app.models.association import user_tags
from app.schemas.user import UserProfile, UserUpdate
from app.utils.security import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/me",
    response_model=UserProfile,
    summary="내 프로필 조회",
    description="현재 로그인한 사용자의 프로필 정보를 반환합니다.",
)
async def get_profile(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(
        select(User).options(selectinload(User.preferred_tags)).where(User.id == current_user.id)
    )
    u = result.scalar_one()
    return UserProfile(
        id=u.id,
        email=u.email,
        nickname=u.nickname,
        bio=u.bio,
        profile_image_url=u.profile_image_url,
        birthdate=u.birthdate,
        preferred_tags=[t.name for t in u.preferred_tags if t.tag_type == "preference"],
    )


@router.put(
    "/me",
    response_model=UserProfile,
    summary="내 프로필 수정",
    description="닉네임/자기소개/프로필 이미지 URL을 수정합니다. 닉네임은 고유해야 하며 중복 시 400을 반환합니다.",
)
async def update_profile(payload: UserUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if payload.nickname is not None:
        # ensure nickname unique if changed
        if payload.nickname != current_user.nickname:
            exists = await db.execute(select(User).where(User.nickname == payload.nickname))
            if exists.scalar_one_or_none() is not None:
                raise HTTPException(status_code=400, detail="Nickname already in use")
        current_user.nickname = payload.nickname
    if payload.bio is not None:
        current_user.bio = payload.bio
    if payload.profile_image_url is not None:
        current_user.profile_image_url = payload.profile_image_url
    if payload.birthdate is not None:
        current_user.birthdate = payload.birthdate

    await db.commit()
    # reload with preferred_tags
    result = await db.execute(
        select(User).options(selectinload(User.preferred_tags)).where(User.id == current_user.id)
    )
    u = result.scalar_one()
    return UserProfile(
        id=u.id,
        email=u.email,
        nickname=u.nickname,
        bio=u.bio,
        profile_image_url=u.profile_image_url,
        birthdate=u.birthdate,
        preferred_tags=[t.name for t in u.preferred_tags if t.tag_type == "preference"],
    )


@router.get(
    "/me/likes",
    response_model=list[dict],
    summary="내가 좋아요한 전시 목록",
    description="현재 사용자가 좋아요한 전시들의 요약 정보를 반환합니다.",
)
async def my_likes(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # return minimal exhibition info
    return [{"id": e.id, "name": e.name, "poster_url": e.poster_url, "average_rating": e.average_rating} for e in current_user.liked_exhibitions]


@router.get(
    "/me/reviews",
    response_model=list[dict],
    summary="내 리뷰 목록",
    description="현재 사용자가 작성한 리뷰들의 요약 정보를 반환합니다.",
)
async def my_reviews(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return [{"id": r.id, "exhibition_id": r.exhibition_id, "rating": r.rating, "content": r.content} for r in current_user.reviews]


@router.get("/me/tags", response_model=list[str], summary="내 선호 태그 목록", description="현재 사용자가 선호로 설정한 태그(선호 타입)의 이름 목록을 반환합니다.")
async def my_tags(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return [t.name for t in current_user.preferred_tags if t.tag_type == "preference"]


@router.put("/me/tags", response_model=list[str], summary="내 선호 태그 설정", description="태그 이름 배열을 받아 선호 태그를 덮어씁니다. 태그가 없으면 생성됩니다. 장르 태그는 별도 전시 데이터에 연결됩니다.")
async def update_my_tags(names: list[str], db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    normalized = [n.strip().lower() for n in names if n and n.strip()]
    if not normalized:
        current_user.preferred_tags = []
        await db.commit()
        await db.refresh(current_user)
        return []

    tag_objs: list[Tag] = []
    for name in normalized:
        res = await db.execute(select(Tag).where((Tag.name == name) & (Tag.tag_type == "preference")))
        tag = res.scalar_one_or_none()
        if tag is None:
            tag = Tag(name=name, tag_type="preference")
            db.add(tag)
            await db.flush()
        tag_objs.append(tag)

    current_user.preferred_tags = tag_objs
    await db.commit()
    await db.refresh(current_user)
    return [t.name for t in current_user.preferred_tags]
