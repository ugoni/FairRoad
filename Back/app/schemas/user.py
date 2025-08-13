from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date


class UserBase(BaseModel):
    email: EmailStr
    nickname: str

    model_config = {
        "from_attributes": True,
    }


class UserProfile(BaseModel):
    id: int
    email: EmailStr
    nickname: str
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None
    birthdate: Optional[date] = None

    preferred_tags: Optional[List[str]] = None

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    nickname: Optional[str] = None
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None
    topic_ids: Optional[List[int]] = None
    birthdate: Optional[date] = None
