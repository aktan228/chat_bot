from fastapi import HTTPException, APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.db import SessionLocal
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    ChatRequest,
    ChatResponse,
    UserRead,
    ChatMessagesRead,
)
from app.schemas.user import UserSettingsUpdate
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.utils.jwt_handler import create_access_token, verify_token
from app.services.chat_service import generate_response_with_history
from app.models.chat import ChatMessages
from app.database.db import get_db
from app.utils.jwt_handler import verify_token
from typing import List
from app.schemas.user import ChatSummary
from sqlalchemy import func
from app.utils.dependencies import get_current_user, get_current_user_with_db

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


@router.get("/user/settings")
def get_user_settings(user: User = Depends(get_current_user_with_db)):
    return {
        "theme": user.theme,
        "language": user.language,
        "font_size": user.font_size,
        "font_family": user.font_family,
    }


@router.post("/user/settings")
def update_user_settings(
    settings: UserSettingsUpdate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    user = get_current_user(token=token, db=db)

    if settings.theme:
        user.theme = settings.theme
    if settings.language:
        user.language = settings.language

    db.commit()
    db.refresh(user)

    return {
        "message": "Settings updated",
        "theme": user.theme,
        "language": user.language,
    }


# 12321232143


@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(
    request: ChatRequest,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_email = payload.get("sub")

    response, chat_id = generate_response_with_history(
        prompt=request.prompt,
        user_email=user_email,
        db=db,
        chat_id=request.chat_id,
        topic=request.topic,
        # language=request.language
    )

    return {"response": response, "chat_id": chat_id}


# сессии
@router.get("/chat/sessions")
def list_sessions(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):

    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Недействительный токен")
    user_email = payload.get("sub")

    sessions = (
        db.query(ChatMessages.chat_id)
        .filter(ChatMessages.user_email == user_email)
        .distinct()
        .all()
    )

    return [s.chat_id for s in sessions]


# story of my chats


@router.get("/chat/list", response_model=List[ChatSummary])
def list_chats(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Недействительный токен")

    user_email = payload.get("sub")

    subquery = (
        db.query(
            ChatMessages.chat_id, func.max(ChatMessages.timestamp).label("last_time")
        )
        .filter(ChatMessages.user_email == user_email)
        .group_by(ChatMessages.chat_id)
        .subquery()
    )

    result = (
        db.query(
            ChatMessages.chat_id,
            ChatMessages.content.label("last_message"),
            ChatMessages.timestamp,
        )
        .join(
            subquery,
            (ChatMessages.chat_id == subquery.c.chat_id)
            & (ChatMessages.timestamp == subquery.c.last_time),
        )
        .all()
    )

    return [
        {
            "chat_id": row.chat_id,
            "last_message": row.last_message,
            "timestamp": row.timestamp.isoformat(),
        }
        for row in result
    ]


#


@router.get("/chat/{chat_id}", response_model=List[ChatMessagesRead])
def get_chat_by_id(
    chat_id: str, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    payload = verify_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_email = payload["sub"]
    chat = (
        db.query(ChatMessages)
        .filter(ChatMessages.chat_id == chat_id, ChatMessages.user_email == user_email)
        .order_by(ChatMessages.timestamp)
        .all()
    )

    return chat


# история чата


@router.get("/chat/history", response_model=List[ChatMessagesRead])
def get_history(
    chat_id: str = Query(...),
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    payload = verify_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token or missing subject")

    user_email = payload["sub"]

    history = (
        db.query(ChatMessages)
        .filter(ChatMessages.user_email == user_email, ChatMessages.chat_id == chat_id)
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
    # if db.query(User).filter(User.username == user.username).first():
    #     raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        # username=user.username,
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

# adwwadw


@router.get("/protected")
def protected_route(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"message": "Access granted", "user": payload["sub"]}
