from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base


class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False
    )

    institution = Column(String(150), nullable=False)
    degree = Column(String(100))
    field_of_study = Column(String(100))
    start_year = Column(Integer)
    end_year = Column(Integer)
    grade = Column(String(50))

    created_at = Column(DateTime, server_default=func.now())