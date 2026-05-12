from datetime import datetime, timedelta
import jwt
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth import SignupRequest

from app.config import settings
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def create_access_token(*, user: User) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    payload = {
        "sub": str(user.id),
        "username": user.username,
        "exp": expire,
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def signup(db: Session, data: SignupRequest) -> User:
    existing = db.query(User).filter(User.username == data.username).first()
    if existing:
        # keep it simple; frontend displays response text
        raise ValueError("Username already exists")

    user = User(username=data.username, password_hash=hash_password(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login(db: Session, *, username: str, password: str) -> User:
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise ValueError("Invalid username or password")

    if not verify_password(password, user.password_hash):
        raise ValueError("Invalid username or password")

    return user

