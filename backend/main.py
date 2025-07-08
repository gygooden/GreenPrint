# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from routes import router as habit_router
from database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="GreenPrint API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(habit_router, prefix="/habits", tags=["habits"])

@app.get("/")
def root():
    return {"message": "GreenPrint backend is running!"}