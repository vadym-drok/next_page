from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_session
from sqlmodel import Session
from app.models import UserCreate, UserResponse, Token, User
from app.crud import create_user, create_access_token, create_shop
from app.utils import authenticate_user, get_user_by_username, get_user_by_email, verify_access_token

router = APIRouter(
    prefix='',
    tags=['Users'],
)


@router.post("/users", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_session)):
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="User with this email already registered")
    new_user = create_user(db, user)
    create_shop(db, new_user)

    return new_user


@router.post('/login', response_model=Token)
def login(login_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_session)):
    """
    Login using your username and password
    """
    user = authenticate_user(db, login_data.username, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token_data = {
        "username": user.username,
    }
    access_token = create_access_token(token_data)
    return access_token


@router.get('/user_info', response_model=UserResponse)
def get_user_info(
        current_user: User = Depends(verify_access_token),
):
    """
    Get information about User
    """

    return current_user
