from sqlalchemy import Column, Integer, ForeignKey
from ..database import Base


class InternshipSkill(Base):
    __tablename__ = "internship_skills"

    id = Column(Integer, primary_key=True, index=True)
    internship_id = Column(
        Integer,
        ForeignKey("internships.id", ondelete="CASCADE"),
        nullable=False
    )
    skill_id = Column(
        Integer,
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False
    )