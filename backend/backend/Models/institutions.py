from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from ..database import Base


class Institution(Base):
    __tablename__ = "institutions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(100), unique=True)
    description = Column(Text)
    location = Column(String(150))
    website = Column(String(255))
    logo_url = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())