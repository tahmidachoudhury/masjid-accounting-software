import csv
import io
from dataclasses import dataclass, field
from typing import Any

from sqlalchemy.orm import Session

from app.enums import DonationType, SourceType
from app.schemas.donation import DonationCreate
from app.services.donation import create_donation

_VALID_TYPES = {t.value for t in DonationType if t != DonationType.uncategorised}


@dataclass
class ImportResult:
    classified: list[dict[str, Any]] = field(default_factory=list)
    uncategorised: list[dict[str, Any]] = field(default_factory=list)
    errors: list[dict[str, Any]] = field(default_factory=list)


def parse_bank_statement(db: Session, csv_content: str) -> ImportResult:
    result = ImportResult()
    reader = csv.DictReader(io.StringIO(csv_content.strip()))

    for row_num, row in enumerate(reader, start=2):
        try:
            raw_amount = (
                row.get("amount_gbp") or row.get("amount") or row.get("amount_pence") or ""
            ).strip().replace("£", "").replace(",", "")

            if not raw_amount:
                result.errors.append({"row": row_num, "error": "Missing amount", "row_data": dict(row)})
                continue

            # If column is named amount_pence, treat as integer pence directly
            if "amount_pence" in (row or {}):
                amount_pence = int(raw_amount)
            else:
                amount_pence = int(round(float(raw_amount) * 100))

            if amount_pence <= 0:
                result.errors.append(
                    {"row": row_num, "error": "Amount must be positive", "row_data": dict(row)}
                )
                continue

            raw_type = (
                row.get("donation_type") or row.get("type") or ""
            ).strip().lower().replace(" ", "_")

            dtype = DonationType(raw_type) if raw_type in _VALID_TYPES else DonationType.uncategorised

            donor_ref = (
                row.get("reference") or row.get("description") or row.get("ref") or None
            )

            donation = create_donation(
                db,
                DonationCreate(
                    amount_pence=amount_pence,
                    donation_type=dtype,
                    donor_ref=donor_ref,
                    source=SourceType.bulk_import,
                ),
            )
            record = {
                "row": row_num,
                "donation_id": donation.id,
                "amount_pence": amount_pence,
                "donation_type": dtype.value,
                "donor_ref": donor_ref,
            }
            if dtype == DonationType.uncategorised:
                result.uncategorised.append(record)
            else:
                result.classified.append(record)

        except Exception as exc:
            result.errors.append({"row": row_num, "error": str(exc), "row_data": dict(row)})

    return result
