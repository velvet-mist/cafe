from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db
from app.schemas.todos import TodoCreate, TodoUpdate, TodoResponse
from app.services import todo_service

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("/", response_model=List[TodoResponse])
def list_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return todo_service.get_todos(db, skip=skip, limit=limit)


@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = todo_service.get_todo(db, todo_id)
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return todo


@router.post("/", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    return todo_service.create_todo(db, todo)


@router.patch("/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    updated = todo_service.update_todo(db, todo_id, todo)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return updated


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    deleted = todo_service.delete_todo(db, todo_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")