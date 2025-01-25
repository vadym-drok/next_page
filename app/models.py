from datetime import datetime
from typing import Union
from sqlmodel import SQLModel, Field
from pydantic import EmailStr


class Token(SQLModel):
    access_token: str
    token_type: str


class TokenData(SQLModel):
    username: Union[str, None] = None


class UserBase(SQLModel):
    first_name: str
    last_name: str
    username: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    created_at: datetime


# Tables


class User(UserBase, table=True):
    id: int = Field(default=None, primary_key=True)
    email: EmailStr
