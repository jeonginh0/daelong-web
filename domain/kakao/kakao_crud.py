import os
from datetime import timedelta, datetime
from typing import Optional

from fastapi import requests, HTTPException
from jose import jwt
from sqlalchemy.orm import Session
from .kakao_schema import KakaoUserCreate
from models import KakaoUser, User

TOKEN_SECRET_KEY = os.getenv("TOKEN_SECRET_KEY")

# JWT 시크릿 키와 알고리즘 설정
SECRET_KEY = f"{TOKEN_SECRET_KEY}"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 토큰 만료 시간 설정 (30분)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_user_by_token(token: str, db: Session):
    payload = verify_token(token)
    kakao_id: str = payload.get("sub")
    if kakao_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = get_kakao_user_by_kakao_id(db, kakao_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_kakao_user_by_kakao_id(db: Session, kakao_id: str):
    return db.query(KakaoUser).filter(KakaoUser.kakao_id == kakao_id).first()

def create_kakao_user(db: Session, kakao_user: KakaoUserCreate):
    db_kakao_user = KakaoUser(
        kakao_id=kakao_user.kakao_id,
        email=kakao_user.email,
        nickname=kakao_user.nickname  # 닉네임 추가
    )
    db.add(db_kakao_user)
    db.commit()
    db.refresh(db_kakao_user)
    return db_kakao_user
