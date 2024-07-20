from models import History
from sqlalchemy.orm import Session

# 페이지 주소 저장 함수
def save_page_url(db: Session, user_create, page_url):
    new_page = History(page_url=page_url)
    db.add(new_page)
    db.commit()