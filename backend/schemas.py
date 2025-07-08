# backend/schemas.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class HabitLogCreate(BaseModel):
    action: str
    description: Optional[str] = ""
    duration_minutes: int

class HabitLogOut(HabitLogCreate):
    id: int
    carbon_saved: float
    date: date

    class Config:
        from_attributes = True

class HabitSummary(BaseModel):
    total_logs: int
    total_carbon: float
    streak_days: int