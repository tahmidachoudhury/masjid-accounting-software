import uuid
from datetime import datetime

from sqlalchemy.orm import Session

from app.exceptions import DomainError
from app.models.cause import Cause
from app.schemas.cause import CauseCreate


def create_cause(db: Session, data: CauseCreate) -> Cause:
    cause = Cause(
        id=str(uuid.uuid4()),
        name=data.name,
        target_pence=data.target_pence,
        deadline=data.deadline,
        allowed_types=[t.value for t in data.allowed_types],
        created_at=datetime.utcnow().isoformat(),
    )
    db.add(cause)
    db.commit()
    db.refresh(cause)
    return cause


def list_causes(db: Session) -> list[Cause]:
    return db.query(Cause).order_by(Cause.created_at).all()


def get_cause(db: Session, cause_id: str) -> Cause:
    cause = db.get(Cause, cause_id)
    if not cause:
        raise DomainError(f"Cause {cause_id!r} not found")
    return cause
