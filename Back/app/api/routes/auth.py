from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LoginResponse, RegisterRequest
from app.models.review import Tag
from app.schemas.user import UserProfile
from app.utils.security import create_access_token, get_current_user, get_password_hash, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/signup",
    response_model=UserProfile,
    status_code=201,
    summary="회원가입",
    description="이메일, 비밀번호, 닉네임을 받아 새 사용자를 생성합니다. 선택적으로 관심 주제(`topic_ids`)를 연결할 수 있습니다. 이미 등록된 이메일 또는 닉네임이면 400을 반환합니다.",
)
async def signup(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_nickname = await db.execute(select(User).where(User.nickname == payload.nickname))
    if existing_nickname.scalar_one_or_none() is not None:
        raise HTTPException(status_code=400, detail="Nickname already in use")

    user = User(
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        nickname=payload.nickname,
        birthdate=payload.birthdate,
        created_at=datetime.now(tz=timezone.utc),
    )

    # 선호/장르 태그 초기화(회원가입 단계에서 전달되면 생성/연결)
    combined_tags: list[Tag] = []
    if payload.preferred_tags:
        for name in [n.strip().lower() for n in payload.preferred_tags if n and n.strip()]:
            res = await db.execute(select(Tag).where((Tag.name == name) & (Tag.tag_type == "preference")))
            tag = res.scalar_one_or_none()
            if tag is None:
                tag = Tag(name=name, tag_type="preference")
                db.add(tag)
                await db.flush()
            combined_tags.append(tag)
    if payload.genre_tags:
        for name in [n.strip().lower() for n in payload.genre_tags if n and n.strip()]:
            res = await db.execute(select(Tag).where((Tag.name == name) & (Tag.tag_type == "genre")))
            tag = res.scalar_one_or_none()
            if tag is None:
                tag = Tag(name=name, tag_type="genre")
                db.add(tag)
                await db.flush()
            combined_tags.append(tag)
    if combined_tags:
        # 중복 제거 (이름 기준)
        seen = set()
        deduped = []
        for t in combined_tags:
            key = (t.name, t.tag_type)
            if key in seen:
                continue
            seen.add(key)
            deduped.append(t)
        user.preferred_tags = deduped

    db.add(user)
    await db.commit()
    # eager load preferred_tags to avoid MissingGreenlet during serialization
    result = await db.execute(
        select(User).options(selectinload(User.preferred_tags)).where(User.email == payload.email)
    )
    loaded = result.scalar_one()
    return UserProfile(
        id=loaded.id,
        email=loaded.email,
        nickname=loaded.nickname,
        bio=loaded.bio,
        profile_image_url=loaded.profile_image_url,
        birthdate=loaded.birthdate,
        preferred_tags=[t.name for t in loaded.preferred_tags if t.tag_type == "preference"],
    )


@router.post(
    "/login",
    response_model=LoginResponse,
    summary="로그인",
    description="OAuth2 Password Grant 형식으로 로그인합니다. 폼 필드 `username`에는 이메일을, `password`에는 비밀번호를 전달하세요. 인증 실패 시 401을 반환합니다.",
)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    if user is None or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    token = create_access_token(str(user.id))
    return LoginResponse(access_token=token)


@router.get(
    "/me",
    response_model=UserProfile,
    summary="내 프로필 조회",
    description="Bearer 토큰으로 인증된 현재 사용자 프로필을 반환합니다.",
)
async def me(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
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


@router.delete(
    "/me",
    status_code=204,
    summary="회원 탈퇴",
    description="현재 인증된 사용자를 삭제합니다. 성공 시 본문 없이 204를 반환합니다.",
)
async def delete_me(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    await db.delete(current_user)
    await db.commit()
    return None
