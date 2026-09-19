from sqlalchemy import Column, Integer, String, Text
from ..database import Base


class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    department = Column(String(100))

    college = Column(String(150))
    designation = Column(String(100))
    phone = Column(String(20))
    bio = Column(Text)
    expertise = Column(Text)
    profile_image_url = Column(String(255))