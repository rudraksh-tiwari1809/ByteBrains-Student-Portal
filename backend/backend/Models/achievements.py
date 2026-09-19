from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False
    )

    title = Column(String(150), nullable=False)
    description = Column(Text)
    achievement_date = Column(Date)
    issuing_organization = Column(String(150))

    created_at = Column(DateTime, server_default=func.now())