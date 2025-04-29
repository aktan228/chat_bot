from fastapi import FastAPI
from app.database.init_db import init_db
from fastapi import FastAPI
from app.api.routes import router

app = FastAPI()
init_db()
# @app.get("/")
# def read_root():
#     return {"message": "Hello, FastAPI!",
#             "message":"Heallloo woo"}
app.include_router(router)