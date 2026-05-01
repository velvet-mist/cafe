from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./todos.db"
    APP_ENV: str = "development"
    DEBUG: bool = True

    class Config:
        env_file = ".env"


settings = Settings()