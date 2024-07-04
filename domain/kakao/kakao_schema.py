from pydantic import BaseModel

class KakaoUserBase(BaseModel):
    kakao_id: str
    email: str

class KakaoUserCreate(KakaoUserBase):
    pass

class KakaoUser(KakaoUserBase):
    id: int

    class Config:
        orm_mode = True
