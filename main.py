from fastapi import FastAPI # FastAPI 애플리케이션을 생성하는데 사용
from fastapi.templating import Jinja2Templates # FastAPI에서 Jinja2 템플릿 사용
from fastapi import Request # 요청 객체 클래스
import os # 운영체제와 상호작용

app = FastAPI() # FastAPI()를 호출하여 FastAPI 객체를 생성

# 현재 파일의 디렉토리를 기준으로 절대 경로 설정
current_dir = os.path.dirname(os.path.abspath(__file__))
# __file__ 변수를 사용하여 현재 스크립트 파일의 절대 경로를 가져온다.
# dirname = 스크립트 파일의 절대 경로에서 디렉토리만 추출한다.

frontend_dir = os.path.join(current_dir, "frontend/public")
# 앞서 얻은 현재 스크립트 파일의 디렉토리 경로와 "frontend/public" 문자열을 결합,
# 프론트엔드 파일이 위치한 디렉토리의 절대 경로를 얻는다.

# 'frontend/public' 폴더를 templates로 설정
templates = Jinja2Templates(directory=frontend_dir)

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
