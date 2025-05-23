from fastapi import HTTPException, APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate,ChatRequest,ChatResponse, UserRead,ChatMessagesRead
from pydantic import BaseModel
# from app.services.chat_service import generate_response
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from app.utils.jwt_handler import create_access_token, verify_token
from app.utils.jwt_handler import create_access_token, verify_token
from app.services.chat_service import generate_response_with_history
from app.models.chat import ChatMessages
from app.database.db import get_db
from app.utils.jwt_handler import verify_token
from typing import List

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 123435


@router.post("/users/", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=user.password,  # ЗАШИФРОВАТЬ
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# 12321232143
# class ChatRequest(BaseModel):
#     prompt: str


# class ChatResponse(BaseModel):
#     response: str


@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(
    request: ChatRequest,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_email = payload.get("sub")
    response, chat_id = generate_response_with_history(request.prompt, user_email, db, request.chat_id)
    return {"response": response, "chat_id": chat_id}


#сессии
@router.get("/chat/sessions")
def list_sessions(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    user_email = payload.get("sub")

    sessions = db.query(ChatMessages.chat_id)\
        .filter(ChatMessages.user_email == user_email)\
        .distinct().all()

    return [s.chat_id for s in sessions]

# история чата

@router.get("/chat/history", response_model=List[ChatMessagesRead])
def get_history(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token or missing subject")

    user_email = payload["sub"]

    history = (
        db.query(ChatMessages)
        .filter(ChatMessages.user_email == user_email)
        .order_by(ChatMessages.timestamp)
        .all()
    )

    return history


# @router.post("/chat",response_model=)
# 12324


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered"}


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


#!@#!@#%#@%!@#

#adwwadw


@router.get("/protected")
def protected_route(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"message": "Access granted", "user": payload["sub"]}
