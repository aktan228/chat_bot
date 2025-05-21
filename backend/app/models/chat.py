from sqlalchemy import Column, Integer, String,Text,DateTime
from datetime import datetime
from app.database.db import Base

class ChatMessages(Base):
    __tablename__ =  "chat_messages"
    
    id = Column(Integer,primary_key=True,)
    user_email = Column("user_email", String, index=True)
    chat_id = Column(String,index=True)
    role = Column(String,) 
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)  
