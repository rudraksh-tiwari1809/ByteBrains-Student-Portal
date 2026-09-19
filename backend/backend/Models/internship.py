from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base


class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))

    title = Column(String(150), nullable=False)
    description = Column(Text)

    location = Column(String(150))
    duration = Column(String(50))
    stipend = Column(String(50))
    mode = Column(String(30))
    deadline = Column(DateTime)
    status = Column(String(20), default="open")

    posted_at = Column(DateTime, server_default=func.now())