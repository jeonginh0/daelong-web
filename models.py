from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    history = Column(String, nullable=True)

class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True)
    page_url = Column(String, nullable=True)
    page_value = Column(String, nullable=True)