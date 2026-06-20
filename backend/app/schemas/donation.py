from typing import Optional

from pydantic import BaseModel, Field, field_validator

from app.enums import DonationType, SourceType


class DonationCreate(BaseModel):
    amount_pence: int = Field(..., gt=0)
    donation_type: DonationType
    cause_id: Optional[str] = None
    gift_aid: bool = False
    donor_ref: Optional[str] = None
    source: SourceType = SourceType.manual

    @field_validator("amount_pence", mode="before")
    @classmethod
    def must_be_strict_int(cls, v: object) -> int:
        if isinstance(v, bool) or not isinstance(v, int):
            raise ValueError("amount_pence must be a whole integer (pence), never a float")
        return v


class DonationUpdate(BaseModel):
    donation_type: DonationType


class DonationOut(BaseModel):
    id: str
    amount_pence: int
    donation_type: DonationType
    cause_id: Optional[str]
    gift_aid: bool
    donor_ref: Optional[str]
    source: SourceType
    created_at: str

    model_config = {"from_attributes": True}
