from datetime import datetime, date

from sqlalchemy import Column, Date, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.association import exhibition_genre_tags


class Exhibition(Base):
    __tablename__ = "exhibitions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    region: Mapped[str | None] = mapped_column(String(100), index=True)
    # 장소: 전시장 명칭과 주소를 분리
    venue_name: Mapped[str | None] = mapped_column(String(255))
    address: Mapped[str | None] = mapped_column(String(500))
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)

    # 기간
    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)

    # 시간(운영 시간/입장 가능 시간 등): 문자열로 우선 저장
    opening_hours: Mapped[str | None] = mapped_column(String(255))

    # 대상: 예) 전연령, 성인, 초등학생 이상 등
    audience: Mapped[str | None] = mapped_column(String(100))

    # 요금: 복합 요금제/할인 안내가 있을 수 있어 문자열로 저장
    fee: Mapped[str | None] = mapped_column(String(255))

    # 문의(전화번호)
    contact_phone: Mapped[str | None] = mapped_column(String(50))

    description: Mapped[str | None] = mapped_column(Text)
    poster_url: Mapped[str | None] = mapped_column(String(500))
    official_url: Mapped[str | None] = mapped_column(String(500))

    average_rating: Mapped[float] = mapped_column(Float, default=0.0)
    rating_count: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    reviews = relationship("Review", back_populates="exhibition", cascade="all, delete-orphan")

    liked_by_users = relationship(
        "User",
        secondary="user_likes",
        back_populates="liked_exhibitions",
    )

    bookmarked_by_users = relationship(
        "User",
        secondary="user_bookmarks",
        back_populates="bookmarked_exhibitions",
    )

    # 장르 태그 (분류 태그) 연결
    genre_tags = relationship(
        "Tag",
        secondary=exhibition_genre_tags,
        backref="exhibitions",
    )
