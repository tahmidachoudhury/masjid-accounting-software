import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, String, Integer

from app.db import Base


class Donation(Base):
    __tablename__ = "donations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    amount_pence = Column(Integer, nullable=False)
    donation_type = Column(String, nullable=False)
    cause_id = Column(String, nullable=True)
    gift_aid = Column(Boolean, nullable=False, default=False)
    donor_ref = Column(String, nullable=True)
    source = Column(String, nullable=False, default="manual")
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
