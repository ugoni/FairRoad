from datetime import date
from typing import Optional
from pydantic import BaseModel


class CalendarEventCreate(BaseModel):
    title: str
    start_date: date
    end_date: date
    location: Optional[str] = None
    url: Optional[str] = None
    memo: Optional[str] = None
    is_all_day: bool = True


class CalendarEventOut(BaseModel):
    id: int
    title: str
    start_date: date
    end_date: date
    location: Optional[str]
    url: Optional[str]
    memo: Optional[str]
    is_all_day: bool

    model_config = {"from_attributes": True}
