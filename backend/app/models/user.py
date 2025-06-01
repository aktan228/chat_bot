from sqlalchemy import Column, Integer, String
from app.database.db import Base
from pydantic import BaseModel, EmailStr, Field


# sqlalchemy
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    # username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    # добавить поля вроде created_at, is_active, чтобы хранить дату создания пользователя или статус учётной записи

    theme = Column(String, default="dark")  # dark / light
    language = Column(String, default="en")  # en / ru / kg
    font_size = Column(String, default="medium")  # small / medium / large
    font_family = Column(String, default="sans")  # sans / serif / monospace

class useCreate(BaseModel):
    # username: str = Field(min_length=3,max_length=50)
    email: EmailStr
    password: str = Field(min_length=6)
