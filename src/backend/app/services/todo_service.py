from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.todo import Todo
from app.schemas.todos import TodoCreate, TodoUpdate


def get_todos(db: Session, skip: int = 0, limit: int = 100) -> List[Todo]:
    return db.query(Todo).offset(skip).limit(limit).all()


def get_todo(db: Session, todo_id: int) -> Optional[Todo]:
    return db.query(Todo).filter(Todo.id == todo_id).first()


def create_todo(db: Session, todo: TodoCreate) -> Todo:
    db_todo = Todo(**todo.model_dump())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


def update_todo(db: Session, todo_id: int, todo: TodoUpdate) -> Optional[Todo]:
    db_todo = get_todo(db, todo_id)
    if not db_todo:
        return None
    update_data = todo.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)
    db.commit()
    db.refresh(db_todo)
    return db_todo


def delete_todo(db: Session, todo_id: int) -> bool:
    db_todo = get_todo(db, todo_id)
    if not db_todo:
        return False
    db.delete(db_todo)
    db.commit()
    return True