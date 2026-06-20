from typing import Any

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session

import app.services.import_csv as import_service
from app.db import get_db

router = APIRouter(prefix="/import", tags=["import"])


class ImportResponse(BaseModel):
    classified: list[dict[str, Any]]
    uncategorised: list[dict[str, Any]]
    errors: list[dict[str, Any]]
    summary: dict[str, int]


@router.post("/bank-statement", response_model=ImportResponse)
async def import_bank_statement(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a .csv")

    content = (await file.read()).decode("utf-8")
    result = import_service.parse_bank_statement(db, content)

    return ImportResponse(
        classified=result.classified,
        uncategorised=result.uncategorised,
        errors=result.errors,
        summary={
            "classified_count": len(result.classified),
            "uncategorised_count": len(result.uncategorised),
            "error_count": len(result.errors),
        },
    )
