from sqlalchemy import Column, Integer, String, Text, ForeignKey
from ..database import Base


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id = Column(Integer, primary_key=True, index=True)

    assessment_id = Column(
        Integer,
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False
    )

    question = Column(Text, nullable=False)

    option_a = Column(Text)
    option_b = Column(Text)
    option_c = Column(Text)
    option_d = Column(Text)

    correct_option = Column(String(1))
    marks = Column(Integer, default=1)