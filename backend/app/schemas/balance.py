from typing import Optional

from pydantic import BaseModel

from app.enums import DonationType


class TypeBalance(BaseModel):
    donation_type: DonationType
    amount_pence: int


class BalanceSummary(BaseModel):
    balances: list[TypeBalance]
    total_pence: int


class CauseProgress(BaseModel):
    cause_id: str
    name: str
    raised_pence: int
    target_pence: Optional[int]
    percentage: Optional[float]
