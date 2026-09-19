from sqlalchemy import Column, Integer, String, Text
from ..database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    industry_type = Column(String(100))

    description = Column(Text)
    website = Column(String(255))
    location = Column(String(150))
    logo_url = Column(String(255))
    contact_phone = Column(String(20))