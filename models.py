from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, func

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    language = Column(String, default="en")
    low_bandwidth_enabled = Column(Boolean, default=False)


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    category = Column(String)
    raw_story = Column(Text)
    formatted_petition = Column(Text, nullable=True)
    status = Column(String, default="DRAFT")
    created_at = Column(DateTime(timezone=True), default=func.now())
