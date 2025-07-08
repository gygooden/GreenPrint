# GreenPrint Backend

This is the FastAPI backend for GreenPrint, a full-stack eco habit tracker. It handles user authentication, habit logging, and carbon savings calculations.

## 🔧 Tech Stack
- Python 3.12+
- FastAPI
- SQLAlchemy
- SQLite (for development)
- JWT Auth via `python-jose`

## 🗂️ Key Files
- `main.py`: FastAPI app entrypoint
- `auth.py`: Handles user registration/login and JWT
- `routes.py`: Habit endpoints
- `eco.py`: CO₂ savings estimation logic
- `models.py`: SQLAlchemy models
- `schemas.py`: Pydantic schemas

## ▶️ Running the Backend
```bash
cd backend
uvicorn main:app --reload