from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from . import kakao_crud, kakao_schema
from database import get_db
import requests
import logging

router = APIRouter()

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
        return db_kakao_user

    # 데이터베이스에 사용자 정보 저장
    kakao_user = kakao_schema.KakaoUserCreate(kakao_id=kakao_id, email=email)
    created_user = kakao_crud.create_kakao_user(db, kakao_user)
    logging.info("Created new user: %s", created_user)
    return created_user
