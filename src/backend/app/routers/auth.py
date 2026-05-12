from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    try:
        user = auth_service.signup(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    token = auth_service.create_access_token(user=user)
    return TokenResponse(access_token=token, username=user.username)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = auth_service.login(db, username=data.username, password=data.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    token = auth_service.create_access_token(user=user)
    return TokenResponse(access_token=token, username=user.username)

