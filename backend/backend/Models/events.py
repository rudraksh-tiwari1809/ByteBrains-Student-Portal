from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)

    institution_id = Column(
        Integer,
        ForeignKey("institutions.id", ondelete="SET NULL")
    )

    title = Column(String(200), nullable=False)
    description = Column(Text)
    event_type = Column(String(50))
    location = Column(String(150))

    event_date = Column(DateTime, nullable=False)
    registration_deadline = Column(DateTime)
    registration_url = Column(String(255))

    status = Column(String(20), default="upcoming")

    created_at = Column(DateTime, server_default=func.now())