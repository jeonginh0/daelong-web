from fastapi import FastAPI, Depends
from requests import Session
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles

import models
from database import get_db
from domain.kakao import kakao_router
from domain.user import user_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.mount("/", StaticFiles(directory="./frontend/build", html=True), name="static")
#
# @app.get("/")
# def index():
#     return FileResponse("frontend/build/index.html")


app.include_router(user_router.router)
app.include_router(kakao_router.router, prefix="/api/user")
