import json
import os
import requests
from datetime import timedelta, datetime
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette import status
from jose import jwt, JWTError
from starlette.responses import RedirectResponse

from database import get_db
from domain.user import user_crud, user_schema
from domain.user.user_crud import pwd_context

load_dotenv()

GOOGLE_TOKEN_ENDPOINT="https://oauth2.googleapis.com/token"
TOKEN_SECRET_KEY = os.getenv("TOKEN_SECRET_KEY")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
SECRET_KEY = f"{TOKEN_SECRET_KEY}"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")

REDIRECT_URI = "http://localhost:8000/api/user/google-login/callback"

router = APIRouter(
    prefix="/api/user",
)


class KakaoLoginRequest(BaseModel):
    access_token: str


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


#회원가입 라우터
@router.post("/create", status_code=status.HTTP_204_NO_CONTENT)
def user_create(user_create: user_schema.UserCreate, db: Session = Depends(get_db)):
    existing_user = user_crud.get_existing_user(db, user_create=user_create)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="이미 존재하는 사용자입니다.")
    user_crud.create_user(db=db, user_create=user_create)


#로그인 라우터
@router.post("/login", response_model=user_schema.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(),
                           db: Session = Depends(get_db)):

    user = user_crud.get_user(db, form_data.username)
    if not user or not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    data = {
        "sub": user.username,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    access_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

    print(access_token)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username
    }


def get_current_user(token: str = Depends(oauth2_scheme),
                     db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = user_crud.get_user(db, username=username)
    if user is None:
        raise credentials_exception
    return user


@router.post("/kakao-login", response_model=user_schema.KakaoLoginResponse)
def kakao_login(request: KakaoLoginRequest, db: Session = Depends(get_db)):
    access_token = request.access_token

    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    kakao_response = requests.get("https://kapi.kakao.com/v2/user/me", headers=headers)

    if kakao_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch user information from Kakao")

    kakao_user_info = kakao_response.json()
    kakao_id = str(kakao_user_info["id"])
    email = kakao_user_info["kakao_account"]["email"]
    kakao_nickname = kakao_user_info["properties"]["nickname"]

    db_kakao_user = user_crud.get_kakao_user_by_kakao_id(db, kakao_id)
    if db_kakao_user:
        token_data = {
            "sub": db_kakao_user.username,
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        }
        access_token = create_access_token(token_data)
        return {
            "access_token": access_token,
            "username": db_kakao_user.username,
            "id": db_kakao_user.id
        }

    kakao_user = user_schema.KakaoUserCreate(
        kakao_id=kakao_id,
        email=email,
        username=kakao_nickname
    )
    created_user = user_crud.create_kakao_user(db, kakao_user)

    token_data = {
        "sub": created_user.username,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    access_token = create_access_token(token_data)

    return {
        "access_token": access_token,
        "username": created_user.username,
        "id": created_user.id
    }


@router.post("/save-url/", response_model=user_schema.User)
def save_url(request: user_schema.SaveUrlRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    print(f"Current user: {current_user}")  # 디버깅을 위한 로그 추가
    user = user_crud.get_user(db, username=current_user.username)
    if user.history:
        history_list = json.loads(user.history)
    else:
        history_list = []
    history_list.append(request.page_url)
    user.history = json.dumps(history_list)
    db.commit()
    db.refresh(user)
    return user


@router.get("/me", response_model=user_schema.User)
async def read_users_me(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    user = user_crud.get_user(db, username=current_user.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    print('Returning user:', user.history)
    return user
