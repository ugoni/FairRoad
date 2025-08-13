from datetime import datetime, date

from sqlalchemy import Column, Date, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship, Mapped, mapped_column

from app.db.base import Base
from app.models.association import user_bookmarks, user_follows, user_likes, user_tags


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)

    nickname: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    profile_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # 생년월일 (선택)
    birthdate: Mapped[date | None] = mapped_column(Date, nullable=True)

    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")

    liked_exhibitions = relationship(
        "Exhibition",
        secondary=user_likes,
        back_populates="liked_by_users",
    )

    bookmarked_exhibitions = relationship(
        "Exhibition",
        secondary=user_bookmarks,
        back_populates="bookmarked_by_users",
    )

    following = relationship(
        "User",
        secondary=user_follows,
        primaryjoin="User.id==user_follows.c.follower_id",
        secondaryjoin="User.id==user_follows.c.following_id",
        backref="followers",
    )

    preferred_tags = relationship(
        "Tag",
        secondary=user_tags,
        back_populates="preferred_by_users",
    )
