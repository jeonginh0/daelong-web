from fastapi import FastAPI, Depends
from requests import Session
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles

import models
from database import get_db
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
#
# # 회원가입 처리를 위한 엔드포인트
# @app.post("/signup/")
# def register_user(name: str, username: str, password: str, email: str, db: Session = Depends(get_db)):
#     # 사용자 정보를 데이터베이스에 저장
#     new_user = models.User(name=name, username=username, password=password, email=email)
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)  # 옵셔널: 필요한 경우 새로고침
#
#     return {"message": "회원가입이 성공적으로 완료되었습니다."}


app.include_router(user_router.router)
