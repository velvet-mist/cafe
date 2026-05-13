from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine
from app.models.todo import Base
from app.routers import todos, planner, auth
from app.models.user import User

Base.metadata.create_all(bind=engine)
User.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API", version="1.0.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todos.router, prefix="/api/v1")
app.include_router(planner.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "Todo API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}
