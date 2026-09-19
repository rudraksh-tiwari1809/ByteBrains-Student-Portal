from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base


class Collaboration(Base):
    __tablename__ = "collaborations"

    id = Column(Integer, primary_key=True, index=True)

    institution_id = Column(
        Integer,
        ForeignKey("institutions.id", ondelete="CASCADE")
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id", ondelete="CASCADE")
    )

    title = Column(String(200), nullable=False)
    description = Column(Text)
    collaboration_type = Column(String(100))
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(String(30), default="active")

    created_at = Column(DateTime, server_default=func.now())