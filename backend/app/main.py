from fastapi import FastAPI
from app.init_db import init_db

from app.api.routes import router

app = FastAPI()

init_db()

@app.get("/")
def read_root():
    return {
    "welcome": "Hello, FastAPI!",
    "greeting": "Heallloo woo",
}

app.include_router(router)
