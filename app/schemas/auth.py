from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import date


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    nickname: str
    birthdate: Optional[date] = None
    # 선호 태그(자유 선호)와 장르 태그(분류) 모두 입력 가능
    preferred_tags: Optional[List[str]] = None
    genre_tags: Optional[List[str]] = None


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
