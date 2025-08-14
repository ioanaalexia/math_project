
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User
from app.db import SessionLocal


def create_user(name, email, password):
    db = SessionLocal()
    if db.query(User).filter_by(email=email).first():
        db.close()
        return None
    hashed_pw = generate_password_hash(password)
    user = User(name=name, email=email, password=hashed_pw)
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return user


def authenticate_user(email, password):
    db = SessionLocal()
    user = db.query(User).filter_by(email=email).first()
    db.close()
    if user and check_password_hash(user.password, password):
        return user
    return None
