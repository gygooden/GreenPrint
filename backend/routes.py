from collections import defaultdict
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
    combined = f"{data.action} {data.description or ''}".strip()
    carbon = estimate_savings(combined, data.duration_minutes)
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
    return {"total_logs": total, "total_carbon": round(carbon, 2), "streak_days": streak}

@router.get("/summary/trend")
def carbon_trend(db: Session = Depends(get_db), user=Depends(get_current_user)):
    logs = db.query(HabitLog).filter(HabitLog.owner_id == user.id).all()
    daily_data = defaultdict(float)
    for log in logs:
        key = log.date.strftime("%Y-%m-%d")
        daily_data[key] += log.carbon_saved
    return [{"date": day, "carbon": round(value, 2)} for day, value in sorted(daily_data.items())]

@router.get("/suggestion")
def suggestion(db: Session = Depends(get_db), user=Depends(get_current_user)):
    logs = db.query(HabitLog).filter(HabitLog.owner_id == user.id).all()
    actions = [l.action for l in logs]
    return {"suggestion": suggest_new_habit(actions)}

@router.put("/{log_id}", response_model=HabitLogOut)
def update_log(log_id: int, data: HabitLogCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    log = db.query(HabitLog).filter_by(id=log_id, owner_id=user.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    log.action = data.action
    log.description = data.description
    log.duration_minutes = data.duration_minutes
    log.carbon_saved = estimate_savings(data.description or data.action, data.duration_minutes)
    
    db.commit()
    db.refresh(log)
    return log

@router.delete("/{log_id}")
def delete_log(log_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    log = db.query(HabitLog).filter_by(id=log_id, owner_id=user.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    db.delete(log)
    db.commit()
    return {"detail": "Log deleted"}