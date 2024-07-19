import json

from passlib.context import CryptContext
from sqlalchemy.orm import Session
from domain.user.user_schema import UserCreate, KakaoUser, KakaoUserCreate
from models import User


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def get_existing_user(db: Session, user_create: UserCreate):
    return db.query(User).filter(
        (User.username == user_create.username) |
        (User.email == user_create.email)
    ).first()


def create_user(db: Session, user_create: UserCreate):
    hashed_password = pwd_context.hash(user_create.password1)
    db_user = User(
        name=user_create.name,
        username=user_create.username,
        email=user_create.email,
        password=hashed_password,
        history=json.loads(user_create.history) if user_create.history else [],
        kakao_id=user_create.kakao_id,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_kakao_user_by_kakao_id(db: Session, kakao_id: str):
    return db.query(User).filter(User.kakao_id == kakao_id).first()


def create_kakao_user(db: Session, kakao_user_create: KakaoUserCreate):
    db_user = User(
        name=kakao_user_create.username,
        username=kakao_user_create.username,
        email=kakao_user_create.email,
        history=json.loads(kakao_user_create.history) if kakao_user_create.history else [],
        kakao_id=kakao_user_create.kakao_id,
        password=""  # 비밀번호를 빈 문자열로 설정
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
