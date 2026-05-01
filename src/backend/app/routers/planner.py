from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date
from typing import List, Optional
from app.dependencies import get_db
from app.schemas.planner import (
    DailyTaskCreate, DailyTaskUpdate, DailyTaskResponse,
    ScheduleSlotUpsert, ScheduleSlotResponse,
    DailyNoteUpsert, DailyNoteResponse,
    DailyStoryUpsert, DailyStoryResponse,
    SongCreate, SongResponse,
    AssignmentCreate, AssignmentUpdate, AssignmentResponse,
    ClassSlotUpsert, ClassSlotResponse,
    StudyNoteUpsert, StudyNoteResponse,
    MarkedDayToggle, MarkedDayResponse,
)
from app.services import planner_service

router = APIRouter(prefix="/planner", tags=["planner"])


# ── DAILY TASKS ──
@router.get("/daily/tasks", response_model=List[DailyTaskResponse])
def list_daily_tasks(date: date, db: Session = Depends(get_db)):
    return planner_service.get_daily_tasks(db, date)

@router.post("/daily/tasks", response_model=DailyTaskResponse, status_code=201)
def create_daily_task(data: DailyTaskCreate, db: Session = Depends(get_db)):
    return planner_service.create_daily_task(db, data)

@router.patch("/daily/tasks/{task_id}", response_model=DailyTaskResponse)
def update_daily_task(task_id: int, data: DailyTaskUpdate, db: Session = Depends(get_db)):
    task = planner_service.update_daily_task(db, task_id, data)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.delete("/daily/tasks/{task_id}", status_code=204)
def delete_daily_task(task_id: int, db: Session = Depends(get_db)):
    if not planner_service.delete_daily_task(db, task_id):
        raise HTTPException(status_code=404, detail="Task not found")


# ── DAILY SCHEDULE ──
@router.get("/daily/schedule", response_model=List[ScheduleSlotResponse])
def get_schedule(date: date, db: Session = Depends(get_db)):
    return planner_service.get_schedule_slots(db, date)

@router.put("/daily/schedule", response_model=ScheduleSlotResponse)
def upsert_schedule(data: ScheduleSlotUpsert, db: Session = Depends(get_db)):
    return planner_service.upsert_schedule_slot(db, data)


# ── DAILY NOTES ──
@router.get("/daily/notes", response_model=Optional[DailyNoteResponse])
def get_daily_note(date: date, db: Session = Depends(get_db)):
    return planner_service.get_daily_note(db, date)

@router.put("/daily/notes", response_model=DailyNoteResponse)
def upsert_daily_note(data: DailyNoteUpsert, db: Session = Depends(get_db)):
    return planner_service.upsert_daily_note(db, data)


# ── DAILY STORY ──
@router.get("/story", response_model=Optional[DailyStoryResponse])
def get_story(date: date, db: Session = Depends(get_db)):
    return planner_service.get_daily_story(db, date)

@router.put("/story", response_model=DailyStoryResponse)
def upsert_story(data: DailyStoryUpsert, db: Session = Depends(get_db)):
    return planner_service.upsert_daily_story(db, data)


# ── MUSIC ──
@router.get("/music", response_model=List[SongResponse])
def list_songs(db: Session = Depends(get_db)):
    return planner_service.get_songs(db)

@router.post("/music", response_model=SongResponse, status_code=201)
def create_song(data: SongCreate, db: Session = Depends(get_db)):
    return planner_service.create_song(db, data)

@router.delete("/music/{song_id}", status_code=204)
def delete_song(song_id: int, db: Session = Depends(get_db)):
    if not planner_service.delete_song(db, song_id):
        raise HTTPException(status_code=404, detail="Song not found")


# ── ASSIGNMENTS ──
@router.get("/study/assignments", response_model=List[AssignmentResponse])
def list_assignments(db: Session = Depends(get_db)):
    return planner_service.get_assignments(db)

@router.post("/study/assignments", response_model=AssignmentResponse, status_code=201)
def create_assignment(data: AssignmentCreate, db: Session = Depends(get_db)):
    return planner_service.create_assignment(db, data)

@router.patch("/study/assignments/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(assignment_id: int, data: AssignmentUpdate, db: Session = Depends(get_db)):
    a = planner_service.update_assignment(db, assignment_id, data)
    if not a:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return a

@router.delete("/study/assignments/{assignment_id}", status_code=204)
def delete_assignment(assignment_id: int, db: Session = Depends(get_db)):
    if not planner_service.delete_assignment(db, assignment_id):
        raise HTTPException(status_code=404, detail="Assignment not found")


# ── CLASS SCHEDULE ──
@router.get("/study/schedule", response_model=List[ClassSlotResponse])
def get_class_schedule(db: Session = Depends(get_db)):
    return planner_service.get_class_slots(db)

@router.put("/study/schedule", response_model=ClassSlotResponse)
def upsert_class_slot(data: ClassSlotUpsert, db: Session = Depends(get_db)):
    return planner_service.upsert_class_slot(db, data)


# ── STUDY NOTES ──
@router.get("/study/notes", response_model=Optional[StudyNoteResponse])
def get_study_notes(db: Session = Depends(get_db)):
    return planner_service.get_study_note(db)

@router.put("/study/notes", response_model=StudyNoteResponse)
def upsert_study_notes(data: StudyNoteUpsert, db: Session = Depends(get_db)):
    return planner_service.upsert_study_note(db, data)


# ── YEARLY ──
@router.get("/yearly", response_model=List[MarkedDayResponse])
def get_marked_days(year: int, db: Session = Depends(get_db)):
    return planner_service.get_marked_days(db, year)

@router.post("/yearly/toggle", response_model=Optional[MarkedDayResponse])
def toggle_day(data: MarkedDayToggle, db: Session = Depends(get_db)):
    return planner_service.toggle_marked_day(db, data.date)