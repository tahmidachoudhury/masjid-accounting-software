import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from app.enums import DonationType
from app.exceptions import DomainError
from app.models.cause import Cause
from app.models.donation import Donation
from app.schemas.donation import DonationCreate, DonationUpdate


def _check_cause_allows_type(cause: Cause, donation_type: DonationType) -> None:
    """Raise DomainError if the cause's allowed_types rejects this donation type."""
    if cause.allowed_types and donation_type.value not in cause.allowed_types:
        raise DomainError(
            f"Donation type '{donation_type.value}' is not accepted by cause '{cause.name}'. "
            f"Allowed: {cause.allowed_types}"
        )


def create_donation(db: Session, data: DonationCreate) -> Donation:
    if data.cause_id:
        cause = db.get(Cause, data.cause_id)
        if not cause:
            raise DomainError(f"Cause {data.cause_id!r} not found")
        _check_cause_allows_type(cause, data.donation_type)

    donation = Donation(
        id=str(uuid.uuid4()),
        amount_pence=data.amount_pence,
        donation_type=data.donation_type.value,
        cause_id=data.cause_id,
        gift_aid=data.gift_aid,
        donor_ref=data.donor_ref,
        source=data.source.value,
        created_at=datetime.utcnow().isoformat(),
    )
    db.add(donation)
    db.commit()
    db.refresh(donation)
    return donation


def list_donations(
    db: Session,
    donation_type: Optional[DonationType] = None,
    cause_id: Optional[str] = None,
    uncategorised_only: bool = False,
) -> list[Donation]:
    query = db.query(Donation)
    if uncategorised_only:
        query = query.filter(Donation.donation_type == DonationType.uncategorised.value)
    elif donation_type:
        query = query.filter(Donation.donation_type == donation_type.value)
    if cause_id:
        query = query.filter(Donation.cause_id == cause_id)
    return query.order_by(Donation.created_at.desc()).all()


def reclassify_donation(db: Session, donation_id: str, data: DonationUpdate) -> Donation:
    donation = db.get(Donation, donation_id)
    if not donation:
        raise DomainError(f"Donation {donation_id!r} not found")
    if donation.donation_type != DonationType.uncategorised.value:
        raise DomainError("Only uncategorised donations can be reclassified via this endpoint")

    if donation.cause_id:
        cause = db.get(Cause, donation.cause_id)
        if cause:
            _check_cause_allows_type(cause, data.donation_type)

    donation.donation_type = data.donation_type.value
    db.commit()
    db.refresh(donation)
    return donation
