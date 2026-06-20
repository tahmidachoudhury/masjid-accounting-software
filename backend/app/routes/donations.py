from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

import app.services.donation as donation_service
from app.db import get_db
from app.enums import DonationType
from app.exceptions import DomainError
from app.schemas.donation import DonationCreate, DonationOut, DonationUpdate

router = APIRouter(prefix="/donations", tags=["donations"])


@router.post("", status_code=201, response_model=DonationOut)
def create_donation(data: DonationCreate, db: Session = Depends(get_db)):
    try:
        return donation_service.create_donation(db, data)
    except DomainError as exc:
        raise HTTPException(status_code=422, detail=str(exc))


@router.get("", response_model=list[DonationOut])
def list_donations(
    donation_type: Optional[DonationType] = Query(None),
    cause_id: Optional[str] = Query(None),
    uncategorised_only: bool = Query(False),
    db: Session = Depends(get_db),
):
    return donation_service.list_donations(db, donation_type, cause_id, uncategorised_only)


@router.patch("/{donation_id}", response_model=DonationOut)
def reclassify_donation(
    donation_id: str,
    data: DonationUpdate,
    db: Session = Depends(get_db),
):
    try:
        return donation_service.reclassify_donation(db, donation_id, data)
    except DomainError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
