from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base


class Mentorship(Base):
    __tablename__ = "mentorships"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False
    )

    faculty_id = Column(
        Integer,
        ForeignKey("faculty.id", ondelete="SET NULL")
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id", ondelete="SET NULL")
    )

    title = Column(String(200))
    description = Column(Text)
    status = Column(String(30), default="active")

    start_date = Column(Date)
    end_date = Column(Date)

    created_at = Column(DateTime, server_default=func.now())