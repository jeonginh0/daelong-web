from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인에서 접근 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# .env 파일 로드
load_dotenv()

# 리액트 애플리케이션의 빌드 디렉토리를 정적 파일 경로로 설정합니다.
app.mount("/", StaticFiles(directory="./frontend/build", html=True), name="static")

# 리액트 애플리케이션의 루트 페이지를 제공합니다.
@app.get("/", response_class=HTMLResponse)
async def serve_index():
    with open("./frontend/build/index.html", "r") as file:
        return file.read()
