from fastapi import APIRouter, HTTPException, Depends, status, Path
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_session
from sqlmodel import Session
from app.models import UserCreate, UserResponse, Token, User, UserEdit
from app.crud import create_user, create_access_token, create_shop
from app.utils import authenticate_user, get_user_by_username, get_user_by_email, verify_access_token, get_user_by_id

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


@router.get('/users/{id}/', response_model=UserResponse)
def user_info(
        id: int = Path(description="user id"),
        db: Session = Depends(get_session),
        current_user: User = Depends(verify_access_token),
):
    """
    Get information about User
    """

    return get_user_by_id(db, current_user, id)


@router.post('/users/{id}/edit', response_model=UserResponse)
def edit_user(
        user_edit_data: UserEdit,
        id: int = Path(description="user id"),
        db: Session = Depends(get_session),
        current_user: User = Depends(verify_access_token),
):
    """

    """
    db_user = get_user_by_id(db, current_user, id)
    user_data = user_edit_data.dict(exclude_unset=True)
    for key, value in user_data.items():
        setattr(db_user, key, value)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return current_user
