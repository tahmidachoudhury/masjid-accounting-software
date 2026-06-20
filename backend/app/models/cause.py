import uuid
from datetime import datetime

from sqlalchemy import Column, Date, Integer, JSON, String

from app.db import Base


class Cause(Base):
    __tablename__ = "causes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    target_pence = Column(Integer, nullable=True)
    deadline = Column(Date, nullable=True)
    allowed_types = Column(JSON, nullable=False, default=list)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
