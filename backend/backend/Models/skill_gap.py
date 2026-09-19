from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base


class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    missing_skill_id = Column(Integer, ForeignKey("skills.id"))
    severity = Column(String(20))
    generated_at = Column(DateTime, server_default=func.now())