from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./todos.db"
    APP_ENV: str = "development"
    DEBUG: bool = True

    JWT_SECRET: str = "change-me"  # override via env var in production
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24  # 1 day


    class Config:
        env_file = ".env"


settings = Settings()