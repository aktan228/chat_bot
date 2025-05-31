from pydantic import BaseModel,EmailStr
# pydantic schema for API
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    # username: str
    email: EmailStr
    password: str
class ChatSummary(BaseModel):
    chat_id: str
    last_message: str
    timestamp: str 

class UserRead(BaseModel):
    id: int
    # username: str
    email: EmailStr

    model_config = {"from_attributes": True}
    
class ChatMessagesRead(BaseModel):
    chat_id: str   
    role:str
    content: str
    timestamp:datetime
    
    
    model_config = {
        "from_attributes": True
    }
        
class ChatRequest(BaseModel):
    prompt: str
    chat_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    chat_id: str