from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import RedirectResponse

app = FastAPI()

# React 앱의 정적 파일들을 서빙하기 위해 build 디렉토리를 정적 파일 경로로 설정합니다.
# 여기서 'build'는 React 앱에서 빌드한 디렉토리 이름입니다. 실제로는 해당 디렉토리의 경로를 지정해야 합니다.
app.mount("/", StaticFiles(directory="./frontend/build", html=True), name="static")

# 루트 경로('/')로 요청이 오면 index.html 파일로 리다이렉트합니다.
@app.get("/")
async def redirect_to_index():
    return RedirectResponse(url="/index.html")
