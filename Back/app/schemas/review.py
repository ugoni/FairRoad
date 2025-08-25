from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class ReviewCreate(BaseModel):
    rating: int
    content: Optional[str] = None
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None


class ReviewOut(BaseModel):
    id: int
    user_id: int
    exhibition_id: int
    rating: int
    content: Optional[str]
    images: Optional[List[str]]
    created_at: datetime
    tags: List[str] = []

    model_config = {"from_attributes": True}
