from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserRead

router =APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@router.post("/users/",response_class=UserRead)
def create_user(user:UserCreate, db:Session = Depends(get_db)):
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=user.password  #ЗАШИФРОВАТЬ
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user