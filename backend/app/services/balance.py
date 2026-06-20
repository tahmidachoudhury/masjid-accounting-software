from sqlalchemy import func
from sqlalchemy.orm import Session

from app.enums import DonationType
from app.exceptions import DomainError
from app.models.cause import Cause
from app.models.donation import Donation
from app.schemas.balance import BalanceSummary, CauseProgress, TypeBalance


def compute_balances(db: Session) -> BalanceSummary:
    """Derive per-type balances from donations. Uncategorised are always excluded."""
    rows = (
        db.query(Donation.donation_type, func.sum(Donation.amount_pence))
        .filter(Donation.donation_type != DonationType.uncategorised.value)
        .group_by(Donation.donation_type)
        .all()
    )
    balances = [TypeBalance(donation_type=row[0], amount_pence=row[1]) for row in rows]
    return BalanceSummary(
        balances=balances,
        total_pence=sum(b.amount_pence for b in balances),
    )


def compute_cause_progress(db: Session, cause_id: str) -> CauseProgress:
    """Raised amount excludes any uncategorised donations against the cause."""
    cause = db.get(Cause, cause_id)
    if not cause:
        raise DomainError(f"Cause {cause_id!r} not found")

    raised: int = (
        db.query(func.sum(Donation.amount_pence))
        .filter(
            Donation.cause_id == cause_id,
            Donation.donation_type != DonationType.uncategorised.value,
        )
        .scalar()
    ) or 0

    percentage: float | None = None
    if cause.target_pence and cause.target_pence > 0:
        percentage = round((raised / cause.target_pence) * 100, 1)

    return CauseProgress(
        cause_id=cause_id,
        name=cause.name,
        raised_pence=raised,
        target_pence=cause.target_pence,
        percentage=percentage,
    )
