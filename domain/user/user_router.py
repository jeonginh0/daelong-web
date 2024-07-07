import os
from datetime import timedelta, datetime
from fastapi import APIRouter, HTTPException
import requests
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette import status

from jose import jwt, JWTError
from starlette.responses import JSONResponse

from database import get_db
from domain.user import user_crud, user_schema
from domain.user.user_crud import pwd_context

TOKEN_SECRET_KEY = os.getenv("TOKEN_SECRET_KEY")

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
SECRET_KEY = f"{TOKEN_SECRET_KEY}"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/user/login")

router = APIRouter(
    prefix="/api/user",
)


class KakaoLoginRequest(BaseModel):
    access_token: str


@router.post("/create", status_code=status.HTTP_204_NO_CONTENT)
def user_create(user_create: user_schema.UserCreate, db: Session = Depends(get_db)):
    existing_user = user_crud.get_existing_user(db, user_create=user_create)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="이미 존재하는 사용자입니다.")
    user_crud.create_user(db=db, user_create=user_create)

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

@router.post("/kakao-login", response_model=user_schema.KakaoUser)
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
        return db_kakao_user

    kakao_user = user_schema.KakaoUserCreate(
        kakao_id=kakao_id,
        email=email,
        username=kakao_nickname
    )
    created_user = user_crud.create_kakao_user(db, kakao_user)

    return created_user

@router.get("/me", response_model=user_schema.User)
async def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    return user

@router.get("/kakao-user/{kakao_id}", response_model=user_schema.KakaoUser)
def get_kakao_user(kakao_id: str, db: Session = Depends(get_db)):
    db_kakao_user = user_crud.get_kakao_user_by_kakao_id(db, kakao_id)
    if db_kakao_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_kakao_user