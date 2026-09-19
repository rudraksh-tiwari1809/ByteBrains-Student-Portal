from sqlalchemy import Column, Integer, String, Text, Date, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False
    )

    company_name = Column(String(150), nullable=False)
    role = Column(String(150))
    description = Column(Text)
    start_date = Column(Date)
    end_date = Column(Date)
    is_current = Column(Boolean, default=False)

    created_at = Column(DateTime, server_default=func.now())