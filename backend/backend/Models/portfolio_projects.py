from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from ..database import Base


class PortfolioProject(Base):
    __tablename__ = "portfolio_projects"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False
    )

    title = Column(String(150), nullable=False)
    description = Column(Text)
    project_url = Column(String(255))
    github_url = Column(String(255))
    technologies = Column(Text)
    created_at = Column(DateTime, server_default=func.now())