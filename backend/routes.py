# backend/routes.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import HabitLogCreate, HabitLogOut, HabitSummary
from models import HabitLog
from auth import get_current_user
from database import get_db
from eco import estimate_savings, suggest_new_habit
from datetime import date, timedelta

router = APIRouter()

@router.post("/", response_model=HabitLogOut)
def log_habit(data: HabitLogCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    carbon = estimate_savings(data.description or data.action, data.duration_minutes)
    log = HabitLog(
        action=data.action,
        description=data.description,
        duration_minutes=data.duration_minutes,
        carbon_saved=carbon,
        owner_id=user.id
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

@router.get("/", response_model=list[HabitLogOut])
def get_logs(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(HabitLog).filter(HabitLog.owner_id == user.id).order_by(HabitLog.date.desc()).all()

@router.get("/summary", response_model=HabitSummary)
def summary(db: Session = Depends(get_db), user=Depends(get_current_user)):
    logs = db.query(HabitLog).filter(HabitLog.owner_id == user.id).all()
    total = len(logs)
    carbon = sum([l.carbon_saved for l in logs])
    today = date.today()
    streak = 0
    for i in range(7):  # 7-day streak check
        if any(l.date == today - timedelta(days=i) for l in logs):
            streak += 1
        else:
            break
    return {"total_logs": total, "total_carbon": carbon, "streak_days": streak}

@router.get("/suggestion")
def suggestion(db: Session = Depends(get_db), user=Depends(get_current_user)):
    logs = db.query(HabitLog).filter(HabitLog.owner_id == user.id).all()
    actions = [l.action for l in logs]
    return {"suggestion": suggest_new_habit(actions)}