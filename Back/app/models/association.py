from sqlalchemy import Column, ForeignKey, Table, UniqueConstraint

from app.db.base import Base

user_likes = Table(
    "user_likes",
    Base.metadata,
    Column("user_id", ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("exhibition_id", ForeignKey("exhibitions.id", ondelete="CASCADE"), primary_key=True),
    UniqueConstraint("user_id", "exhibition_id", name="uq_user_like"),
)

user_bookmarks = Table(
    "user_bookmarks",
    Base.metadata,
    Column("user_id", ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("exhibition_id", ForeignKey("exhibitions.id", ondelete="CASCADE"), primary_key=True),
    UniqueConstraint("user_id", "exhibition_id", name="uq_user_bookmark"),
)

user_follows = Table(
    "user_follows",
    Base.metadata,
    Column("follower_id", ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("following_id", ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    UniqueConstraint("follower_id", "following_id", name="uq_user_follow"),
)

review_tags = Table(
    "review_tags",
    Base.metadata,
    Column("review_id", ForeignKey("reviews.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
    UniqueConstraint("review_id", "tag_id", name="uq_review_tag"),
)

# 사용자 선호 태그 연결 테이블
user_tags = Table(
    "user_tags",
    Base.metadata,
    Column("user_id", ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
    UniqueConstraint("user_id", "tag_id", name="uq_user_tag"),
)

# 전시-장르 태그 연결 테이블
exhibition_genre_tags = Table(
    "exhibition_genre_tags",
    Base.metadata,
    Column("exhibition_id", ForeignKey("exhibitions.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
    UniqueConstraint("exhibition_id", "tag_id", name="uq_exhibition_genre_tag"),
)

# 메시지/대화방 관련 테이블은 ORM 클래스로 정의 (association는 없음)
