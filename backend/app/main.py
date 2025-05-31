from fastapi import FastAPI
from app.init_db import init_db
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(router, prefix="/api")
app.include_router(router)

@app.get("/api/chat")
def read_root():
    return {
        "welcome": "Hello, FastAPI!",
        "greeting": "Heallloo woo",
    }