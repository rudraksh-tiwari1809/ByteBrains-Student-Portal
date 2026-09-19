from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from ..database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    branch = Column(String(100))
    college = Column(String(150))
    year = Column(String(20))
    phone = Column(String(20))
    location = Column(String(150))
    enrollment = Column(String(100))
    about = Column(Text)

    created_at = Column(DateTime, server_default=func.now())