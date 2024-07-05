from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

from models import User
from . import kakao_crud, kakao_schema
from database import get_db
import requests
import logging


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class KakaoLoginRequest(BaseModel):
    access_token: str


@router.post("/kakao-login", response_model=kakao_schema.KakaoUser)
def kakao_login(request: KakaoLoginRequest, db: Session = Depends(get_db)):
    access_token = request.access_token
    logging.info("Received access token: %s", access_token)

    # 카카오 API를 통해 사용자 정보 가져오기
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    kakao_response = requests.get("https://kapi.kakao.com/v2/user/me", headers=headers)
    logging.info("Kakao response: %s", kakao_response.text)

    if kakao_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch user information from Kakao")

    kakao_user_info = kakao_response.json()
    kakao_id = str(kakao_user_info["id"])
    email = kakao_user_info["kakao_account"]["email"]
    kakao_nickname = kakao_user_info["properties"]["nickname"]  # 카카오톡 닉네임 가져오기

    logging.info("Kakao user info: id=%s, email=%s, nickname=%s", kakao_id, email, kakao_nickname)

    # 사용자 정보가 데이터베이스에 존재하는지 확인
    db_kakao_user = kakao_crud.get_kakao_user_by_kakao_id(db, kakao_id)
    if db_kakao_user:
        logging.info("User already exists in DB: %s", db_kakao_user)
        return JSONResponse(content={
            "id": db_kakao_user.id,
            "kakao_id": db_kakao_user.kakao_id,
            "email": db_kakao_user.email,
            "nickname": db_kakao_user.nickname
        })

    # 데이터베이스에 사용자 정보 저장
    kakao_user = kakao_schema.KakaoUserCreate(kakao_id=kakao_id, email=email, nickname=kakao_nickname)
    created_user = kakao_crud.create_kakao_user(db, kakao_user)
    logging.info("Created new user: %s", created_user)

    return JSONResponse(content={
        "id": created_user.id,
        "kakao_id": created_user.kakao_id,
        "email": created_user.email,
        "nickname": created_user.nickname,
        "access_token": access_token  # 액세스 토큰도 함께 반환
    })


@router.get("/me", response_model=kakao_schema.KakaoUser)
async def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # 여기서 토큰을 검증하고 사용자 정보를 가져오는 로직을 구현해야 합니다.
    user = kakao_crud.get_user_by_token(token, db)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return JSONResponse(content={
        "id": user.id,
        "kakao_id": user.kakao_id,
        "email": user.email,
        "nickname": user.nickname
    })


@router.get("/kakao-user/{kakao_id}", response_model=kakao_schema.KakaoUser)
def get_kakao_user(kakao_id: str, db: Session = Depends(get_db)):
    db_kakao_user = kakao_crud.get_kakao_user_by_kakao_id(db, kakao_id)
    if db_kakao_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return JSONResponse(content={
        "id": db_kakao_user.id,
        "kakao_id": db_kakao_user.kakao_id,
        "email": db_kakao_user.email,
        "nickname": db_kakao_user.nickname
    })