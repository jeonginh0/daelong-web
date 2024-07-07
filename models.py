from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    history = Column(String, nullable=True)
    kakao_id = Column(String, unique=True, nullable=True)

    # kakao_user = relationship("KakaoUser", back_populates="user", uselist=False)

class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True)
    page_url = Column(String, nullable=True)
    page_value = Column(String, nullable=True)

# class KakaoUser(Base):
#     __tablename__ = "kakao_user"
#
#     id = Column(Integer, primary_key=True)
#     kakao_id = Column(String, unique=True, nullable=False)
#     email = Column(String, unique=True, nullable=False)
#     nickname = Column(String, nullable=True)  # 닉네임 필드 추가
#     user_id = Column(Integer, ForeignKey('user.id'))
#
#     user = relationship("User", back_populates="kakao_user")
