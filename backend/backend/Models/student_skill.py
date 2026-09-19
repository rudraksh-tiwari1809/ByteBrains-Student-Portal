from sqlalchemy import Column, Integer, String, Float, ForeignKey
from ..database import Base


class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    proficiency = Column(String(20))
    