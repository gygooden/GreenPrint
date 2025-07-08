# backend/models.py

from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import date
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    habits = relationship("HabitLog", back_populates="owner")

class HabitLog(Base):
    __tablename__ = "habits"
    id = Column(Integer, primary_key=True, index=True)
    action = Column(String)
    description = Column(String, nullable=True)
    duration_minutes = Column(Integer)
    carbon_saved = Column(Float)
    date = Column(Date, default=date.today)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="habits")