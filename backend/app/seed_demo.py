"""
Seed the demo flow from CLAUDE.md:
  - £100 zakat, £20 sadaqah (→ Ramadan Iftar cause), £10 zakat al-fitr
  - "Ramadan donation" bulk import → uncategorised, excluded from balances
  - Three causes with partial progress: Roof Repair £10k, Ramadan Iftar £5k, Hardship £7.5k
"""

from app.db import Base, SessionLocal, engine
from app.enums import DonationType, SourceType
from app.models.cause import Cause  # noqa: F401
from app.models.donation import Donation  # noqa: F401
from app.schemas.cause import CauseCreate
from app.schemas.donation import DonationCreate
from app.services.cause import create_cause
from app.services.donation import create_donation


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Causes
        roof = create_cause(db, CauseCreate(name="Roof Repair", target_pence=1_000_000))
        iftar = create_cause(
            db,
            CauseCreate(
                name="Ramadan Iftar",
                target_pence=500_000,
                allowed_types=[DonationType.sadaqah, DonationType.general],
            ),
        )
        hardship = create_cause(db, CauseCreate(name="Hardship Fund", target_pence=750_000))

        # --- Demo flow: three separated type donations ---
        create_donation(
            db,
            DonationCreate(
                amount_pence=10_000,
                donation_type=DonationType.zakat,
                source=SourceType.manual,
                donor_ref="Demo zakat",
            ),
        )
        create_donation(
            db,
            DonationCreate(
                amount_pence=2_000,
                donation_type=DonationType.sadaqah,
                cause_id=iftar.id,
                source=SourceType.manual,
                donor_ref="Demo sadaqah",
            ),
        )
        create_donation(
            db,
            DonationCreate(
                amount_pence=1_000,
                donation_type=DonationType.zakat_al_fitr,
                source=SourceType.manual,
                donor_ref="Demo zakat al-fitr",
            ),
        )

        # --- Uncategorised bank transfer (excluded from balances) ---
        create_donation(
            db,
            DonationCreate(
                amount_pence=7_500,
                donation_type=DonationType.uncategorised,
                source=SourceType.bulk_import,
                donor_ref="Ramadan donation",
            ),
        )

        # --- Cause progress donations ---
        create_donation(db, DonationCreate(amount_pence=320_000, donation_type=DonationType.general, cause_id=roof.id, source=SourceType.manual))
        create_donation(db, DonationCreate(amount_pence=115_000, donation_type=DonationType.sadaqah, cause_id=roof.id, source=SourceType.manual))
        create_donation(db, DonationCreate(amount_pence=195_000, donation_type=DonationType.general, cause_id=iftar.id, source=SourceType.manual))
        create_donation(db, DonationCreate(amount_pence=85_000, donation_type=DonationType.sadaqah, cause_id=iftar.id, source=SourceType.manual))
        create_donation(db, DonationCreate(amount_pence=310_000, donation_type=DonationType.general, cause_id=hardship.id, source=SourceType.manual))
        create_donation(db, DonationCreate(amount_pence=130_000, donation_type=DonationType.sadaqah, cause_id=hardship.id, source=SourceType.manual))
        create_donation(db, DonationCreate(amount_pence=75_000, donation_type=DonationType.lillah, cause_id=hardship.id, source=SourceType.manual))

        print("Demo data seeded.")
        print(f"  Roof Repair:    {roof.id}")
        print(f"  Ramadan Iftar:  {iftar.id}")
        print(f"  Hardship Fund:  {hardship.id}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
