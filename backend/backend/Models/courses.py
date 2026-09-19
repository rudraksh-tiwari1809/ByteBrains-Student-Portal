from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from ..database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)
    description = Column(Text)
    provider = Column(String(150))
    instructor = Column(String(150))
    level = Column(String(50))
    duration = Column(String(50))
    course_url = Column(String(255))
    thumbnail_url = Column(String(255))

    created_at = Column(DateTime, server_default=func.now())