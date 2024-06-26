from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from user import user_router

from dotenv import load_dotenv

import models
from sqlalchemy import inspect
from db.database import engine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 origin 허용, 필요에 따라 변경 가능
    allow_credentials=True,
    allow_methods=["*"],  # 모든 메서드 허용, 필요에 따라 변경 가능
    allow_headers=["*"],  # 모든 헤더 허용, 필요에 따라 변경 가능
)

# .env 파일 로드
load_dotenv()

# 모델 생성
models.Base.metadata.create_all(bind=engine)

# 리액트 애플리케이션의 빌드 디렉토리를 정적 파일 경로로 설정합니다.
app.mount("/", StaticFiles(directory="./frontend/build", html=True), name="static")

# 리액트 애플리케이션의 루트 페이지를 제공합니다.
@app.get("/", response_class=HTMLResponse)
async def serve_index():
    with open("./frontend/build/index.html", "r") as file:
        return HTMLResponse(content=file.read(), status_code=200)

# 유저 라우터 추가
app.include_router(user_router.app)

# 데이터베이스 테이블 목록 가져오기
inspector = inspect(engine)
table_names = inspector.get_table_names()

# 특정 테이블이 있는지 확인
if 'user' in table_names:
    print("\n테이블이 데이터베이스에 존재합니다.\n")
else:
    print("\n테이블이 데이터베이스에 존재하지 않습니다.\n")
