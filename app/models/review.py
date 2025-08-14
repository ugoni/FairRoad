from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    # tag_type: 'preference' | 'genre'
    tag_type: Mapped[str] = mapped_column(String(20))
    # 사용자 선호 태그 역참조
    preferred_by_users = relationship("User", secondary="user_tags", back_populates="preferred_tags")


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    exhibition_id: Mapped[int] = mapped_column(ForeignKey("exhibitions.id", ondelete="CASCADE"), index=True)

    rating: Mapped[int] = mapped_column(Integer)
    content: Mapped[str | None] = mapped_column(Text)
    images: Mapped[list | None] = mapped_column(JSONB, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    user = relationship("User", back_populates="reviews")
    exhibition = relationship("Exhibition", back_populates="reviews")

    tags = relationship("Tag", secondary="review_tags", backref="reviews")
