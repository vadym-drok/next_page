from fastapi import APIRouter, HTTPException, Depends, status, Path
from app.database import get_session
from sqlmodel import Session
from app.models import ShopInfoResponse, ShopEdit, User, Shop
from app.utils import verify_access_token, get_user_by_id


router = APIRouter(
    prefix='',
    tags=['Shops'],
)


@router.get('/shops/{id}/', response_model=ShopInfoResponse)
def shop(
        id: int = Path(description="shop id"),
        db: Session = Depends(get_session),
        current_user: User = Depends(verify_access_token),
):
    """
    Get information about Shop
    """
    shop = db.query(Shop).filter(Shop.id == id, Shop.user_id == current_user.id).first()

    if shop is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shop not found")

    return shop


@router.post('/shops/{id}/edit', response_model=ShopInfoResponse)
def shop_edit(
        shop_edit_data: ShopEdit,
        id: int = Path(description="shop id"),
        db: Session = Depends(get_session),
        current_user: User = Depends(verify_access_token),
):
    """

    """
    db_shop = db.query(Shop).filter(Shop.id == id, Shop.user_id == current_user.id).first()

    if db_shop is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shop not found")
    shop_data = shop_edit_data.dict(exclude_unset=True)
    for key, value in shop_data.items():
        setattr(db_shop, key, value)

    db.add(db_shop)
    db.commit()
    db.refresh(db_shop)

    return db_shop
