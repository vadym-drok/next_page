from datetime import timedelta, datetime, timezone
from typing import Union
from sqlmodel import Session
from app.models import User, Token, Shop
from app.utils import get_password_hash
import jwt
from app.config import settings


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return Token(access_token=encoded_jwt, token_type="bearer")


def create_user(db: Session, user_data: dict):
    user_data.password = get_password_hash(user_data.password)
    new_user = User(**user_data.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def create_shop(db: Session, user: User):
    shop = Shop(user_id=user.id)
    db.add(shop)
    db.commit()
    db.refresh(shop)
    return shop
