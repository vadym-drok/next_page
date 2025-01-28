from typing import Union, Optional
from pydantic import EmailStr
from datetime import datetime
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, TIMESTAMP, text


class Token(SQLModel):
    access_token: str
    token_type: str


class TokenData(SQLModel):
    username: Union[str, None] = None


class UserBase(SQLModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    created_at: datetime


# Tables


class User(UserBase, table=True):
    id: int = Field(default=None, primary_key=True)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: str
    is_active: Optional[bool] = True
    created_at: datetime = Field(
        sa_column=Column(
            TIMESTAMP(timezone=True), nullable=False, server_default=text('now()')
        )
    )
