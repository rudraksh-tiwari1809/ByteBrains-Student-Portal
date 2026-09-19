from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)
    description = Column(Text)

    skill_id = Column(
        Integer,
        ForeignKey("skills.id", ondelete="SET NULL")
    )

    duration_minutes = Column(Integer)
    total_marks = Column(Integer)
    passing_marks = Column(Integer)

    status = Column(String(20), default="active")

    created_at = Column(DateTime, server_default=func.now())