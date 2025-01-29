from typing import List
from datetime import datetime
from app.models import User, Shop
from app.utils import get_password_hash


users: List[User] = [
    User(
        email="ivan@example.com",
        username="ivan123",
        first_name="Іван",
        last_name="Іванов",
        password=get_password_hash("password1"),
        is_active=True,
        created_at=datetime.utcnow()
    ),
    User(
        email="anna@example.com",
        username="anna456",
        first_name="Анна",
        last_name="Антонова",
        password=get_password_hash("password2"),
        is_active=True,
        created_at=datetime.utcnow()
    ),
]


shops: List[Shop] = [
    Shop(
        name="Електронний світ",
        user_id=1,
        is_active=True
    ),
    Shop(
        name="Книжковий рай",
        user_id=1,
        is_active=True
    ),
    Shop(
        name="Модний бутик",
        user_id=2,
        is_active=False
    ),
]
