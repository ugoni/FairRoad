from datetime import date
from typing import Optional, List

from pydantic import BaseModel


class ExhibitionOut(BaseModel):
    id: int
    name: str
    region: Optional[str] = None
    venue_name: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    opening_hours: Optional[str] = None
    audience: Optional[str] = None
    fee: Optional[str] = None
    contact_phone: Optional[str] = None
    description: Optional[str] = None
    poster_url: Optional[str] = None
    official_url: Optional[str] = None
    average_rating: float
    rating_count: int
    # 장르 태그 이름 목록
    genres: Optional[List[str]] = None

    model_config = {"from_attributes": True}


class MapMarker(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    average_rating: float


class LikeBookmarkResponse(BaseModel):
    success: bool
    liked: Optional[bool] = None
    bookmarked: Optional[bool] = None
    likes_count: Optional[int] = None
