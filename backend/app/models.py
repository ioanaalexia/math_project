from sqlalchemy import Column, Float, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime


Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)


class RequestLog(Base):
    __tablename__ = "request_logs"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    operation = Column(String, nullable=False)
    input_data = Column(String, nullable=False)
    result = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    duration_ms = Column(Float)
