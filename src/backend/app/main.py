from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import todos, planner
from app.database import engine
from app.models.todo import Base as TodoBase
from app.models.planner import Base as PlannerBase

TodoBase.metadata.create_all(bind=engine)
PlannerBase.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(todos.router, prefix="/api/v1")
app.include_router(planner.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Todo API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}