from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base


class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False
    )

    name = Column(String(150), nullable=False)
    issuing_organization = Column(String(150))
    issue_date = Column(Date)
    credential_id = Column(String(100))
    credential_url = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())