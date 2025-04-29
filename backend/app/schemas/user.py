from pydantic import BaseModel

#pydantic schema for API

class UserCreate(BaseModel):
    username: str
    email:str
    password:str

class UserRead(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True