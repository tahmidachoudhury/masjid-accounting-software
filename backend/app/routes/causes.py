from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import app.services.balance as balance_service
import app.services.cause as cause_service
from app.db import get_db
from app.exceptions import DomainError
from app.schemas.balance import CauseProgress
from app.schemas.cause import CauseCreate, CauseOut

router = APIRouter(prefix="/causes", tags=["causes"])


@router.post("", status_code=201, response_model=CauseOut)
def create_cause(data: CauseCreate, db: Session = Depends(get_db)):
    return cause_service.create_cause(db, data)


@router.get("", response_model=list[CauseOut])
def list_causes(db: Session = Depends(get_db)):
    return cause_service.list_causes(db)


@router.get("/{cause_id}/progress", response_model=CauseProgress)
def get_cause_progress(cause_id: str, db: Session = Depends(get_db)):
    try:
        return balance_service.compute_cause_progress(db, cause_id)
    except DomainError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
