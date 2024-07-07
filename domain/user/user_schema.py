from typing import Optional

from pydantic import BaseModel, validator, EmailStr


class UserCreate(BaseModel):
    name: str
    username: str
    password1: str
    password2: str
    email: EmailStr
    history: Optional[str] = ""
    kakao_id: Optional[str] = None

    @validator('name', 'username', 'password1', 'password2', 'email')
    def not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('빈 값은 허용되지 않습니다.')
        return v

    @validator('password2')
    def passwords_match(cls, v, values, **kwargs):
        if 'password1' in values and v != values['password1']:
            raise ValueError('비밀번호가 일치하지 않습니다.')
        return v


class Token(BaseModel):
    access_token: str
    token_type: str
    username: str


class User(BaseModel):
    id: int
    name: str
    username: str
    email: str
    history: Optional[str] = None
    kakao_id: Optional[str] = None

    class Config:
        orm_mode = True


class KakaoUserBase(BaseModel):
    kakao_id: str
    email: str
    username: str
    history: Optional[str] = None

class KakaoUserCreate(KakaoUserBase):
    pass


class KakaoUser(KakaoUserBase):
    id: int

    class Config:
        orm_mode = True