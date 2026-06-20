from datetime import date
from typing import Optional

from pydantic import BaseModel

from app.enums import DonationType


class CauseCreate(BaseModel):
    name: str
    target_pence: Optional[int] = None
    deadline: Optional[date] = None
    allowed_types: list[DonationType] = []


class CauseOut(BaseModel):
    id: str
    name: str
    target_pence: Optional[int]
    deadline: Optional[date]
    allowed_types: list[DonationType]
    created_at: str

    model_config = {"from_attributes": True}
