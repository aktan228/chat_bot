from app.database.db import Base,engine
from app.models.user import User
from app.models.chat import ChatMessages


def init_db():
    Base.metadata.create_all(bind=engine)
    print("table created")
    
if __name__ == "__main__":
    init_db()
