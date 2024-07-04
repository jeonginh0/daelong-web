from sqlalchemy.orm import Session
from .kakao_schema import KakaoUserCreate
from models import KakaoUser
import logging

def get_kakao_user_by_kakao_id(db: Session, kakao_id: str):
    return db.query(KakaoUser).filter(KakaoUser.kakao_id == kakao_id).first()

def create_kakao_user(db: Session, kakao_user: KakaoUserCreate):
    db_kakao_user = KakaoUser(**kakao_user.dict())
    db.add(db_kakao_user)
    db.commit()
    db.refresh(db_kakao_user)
    return db_kakao_user
