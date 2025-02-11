import re

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from passlib.context import CryptContext
from starlette import status
from typing_extensions import Annotated

from app.database import get_session
from sqlmodel import Session
from app.config import settings
from app.models import User, TokenData


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(db: Session, identifier: str, password: str):
    if re.match(r"[^@]+@[^@]+\.[^@]+", identifier):
        user = get_user_by_email(db, identifier)
    else:
        user = get_user_by_username(db, identifier)

    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def verify_access_token(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, current_user: User, id: int):
    if current_user.id != id and not current_user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have access to this User.")

    user = db.query(User).filter(User.id == id).first()

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user
