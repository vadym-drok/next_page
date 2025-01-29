from enum import Enum
from typing import Union, Optional, List
from pydantic import EmailStr
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, TIMESTAMP, text, Enum as SQLEnum


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
    id: int = Field(primary_key=True)
    first_name: str = ''
    last_name: str = ''
    password: str
    is_active: bool = True
    created_at: datetime = Field(
        sa_column=Column(
            TIMESTAMP(timezone=True), nullable=False, server_default=text('now()')
        )
    )
    shops: List["Shop"] = Relationship(back_populates="user")


class Shop(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: Optional[str] = ''
    user_id: int = Field(foreign_key="user.id")
    user: Optional[User] = Relationship(back_populates="shops")
    products: List["Product"] = Relationship(back_populates="shop")
    is_active: Optional[bool] = False


class ProductConditions(str, Enum):
    NEW = 'new'
    USED = 'used'


class Product(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: Optional[str] = ''
    is_active: Optional[bool] = False
    quantity: Optional[int] = 1
    description: Optional[str] = ''
    condition: ProductConditions = Field(
        sa_column=Column(
            SQLEnum(ProductConditions, name="product_conditions"),
            nullable=False,
        )
    )
    shop_id: int = Field(foreign_key="shop.id")
    shop: Optional[Shop] = Relationship(back_populates="products")
