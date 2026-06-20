from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import app.services.balance as balance_service
from app.db import get_db
from app.schemas.balance import BalanceSummary

router = APIRouter(prefix="/balances", tags=["balances"])


@router.get("", response_model=BalanceSummary)
def get_balances(db: Session = Depends(get_db)):
    return balance_service.compute_balances(db)
