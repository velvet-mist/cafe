from sqlalchemy.orm import Session
from datetime import date as Date
from app.models.planner import (
    DailyTask, DailyScheduleSlot, DailyNote,
    DailyStory, Song, Assignment, ClassScheduleSlot,
    StudyNote, MarkedDay
)
from app.schemas.planner import (
    DailyTaskCreate, DailyTaskUpdate,
    ScheduleSlotUpsert, DailyNoteUpsert,
    DailyStoryUpsert, SongCreate,
    AssignmentCreate, AssignmentUpdate,
    ClassSlotUpsert, StudyNoteUpsert
)


# ── DAILY TASKS ──
def get_daily_tasks(db: Session, date: Date):
    return db.query(DailyTask).filter(DailyTask.date == date).all()

def create_daily_task(db: Session, data: DailyTaskCreate):
    task = DailyTask(**data.model_dump())
    db.add(task); db.commit(); db.refresh(task)
    return task

def update_daily_task(db: Session, task_id: int, data: DailyTaskUpdate):
    task = db.query(DailyTask).filter(DailyTask.id == task_id).first()
    if not task: return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(task, k, v)
    db.commit(); db.refresh(task)
    return task

def delete_daily_task(db: Session, task_id: int):
    task = db.query(DailyTask).filter(DailyTask.id == task_id).first()
    if not task: return False
    db.delete(task); db.commit()
    return True


# ── DAILY SCHEDULE ──
def upsert_schedule_slot(db: Session, data: ScheduleSlotUpsert):
    slot = db.query(DailyScheduleSlot).filter(
        DailyScheduleSlot.date == data.date,
        DailyScheduleSlot.hour == data.hour
    ).first()
    if slot:
        slot.text = data.text
    else:
        slot = DailyScheduleSlot(**data.model_dump())
        db.add(slot)
    db.commit(); db.refresh(slot)
    return slot

def get_schedule_slots(db: Session, date: Date):
    return db.query(DailyScheduleSlot).filter(DailyScheduleSlot.date == date).all()


# ── DAILY NOTES ──
def upsert_daily_note(db: Session, data: DailyNoteUpsert):
    note = db.query(DailyNote).filter(DailyNote.date == data.date).first()
    if note:
        note.body = data.body
    else:
        note = DailyNote(**data.model_dump())
        db.add(note)
    db.commit(); db.refresh(note)
    return note

def get_daily_note(db: Session, date: Date):
    return db.query(DailyNote).filter(DailyNote.date == date).first()


# ── DAILY STORY ──
def upsert_daily_story(db: Session, data: DailyStoryUpsert):
    story = db.query(DailyStory).filter(DailyStory.date == data.date).first()
    if story:
        story.mood = data.mood
        story.body = data.body
    else:
        story = DailyStory(**data.model_dump())
        db.add(story)
    db.commit(); db.refresh(story)
    return story

def get_daily_story(db: Session, date: Date):
    return db.query(DailyStory).filter(DailyStory.date == date).first()


# ── SONGS ──
def get_songs(db: Session):
    return db.query(Song).order_by(Song.created_at).all()

def create_song(db: Session, data: SongCreate):
    song = Song(**data.model_dump())
    db.add(song); db.commit(); db.refresh(song)
    return song

def delete_song(db: Session, song_id: int):
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song: return False
    db.delete(song); db.commit()
    return True


# ── ASSIGNMENTS ──
def get_assignments(db: Session):
    return db.query(Assignment).order_by(Assignment.created_at).all()

def create_assignment(db: Session, data: AssignmentCreate):
    a = Assignment(**data.model_dump())
    db.add(a); db.commit(); db.refresh(a)
    return a

def update_assignment(db: Session, assignment_id: int, data: AssignmentUpdate):
    a = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not a: return None
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(a, k, v)
    db.commit(); db.refresh(a)
    return a

def delete_assignment(db: Session, assignment_id: int):
    a = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not a: return False
    db.delete(a); db.commit()
    return True


# ── CLASS SCHEDULE ──
def get_class_slots(db: Session):
    return db.query(ClassScheduleSlot).all()

def upsert_class_slot(db: Session, data: ClassSlotUpsert):
    slot = db.query(ClassScheduleSlot).filter(ClassScheduleSlot.day == data.day).first()
    if slot:
        slot.subject = data.subject
        slot.time = data.time
    else:
        slot = ClassScheduleSlot(**data.model_dump())
        db.add(slot)
    db.commit(); db.refresh(slot)
    return slot


# ── STUDY NOTES ──
def get_study_note(db: Session):
    return db.query(StudyNote).first()

def upsert_study_note(db: Session, data: StudyNoteUpsert):
    note = db.query(StudyNote).first()
    if note:
        note.body = data.body
    else:
        note = StudyNote(body=data.body)
        db.add(note)
    db.commit(); db.refresh(note)
    return note


# ── YEARLY ──
def get_marked_days(db: Session, year: int):
    from sqlalchemy import extract
    return db.query(MarkedDay).filter(extract('year', MarkedDay.date) == year).all()

def toggle_marked_day(db: Session, date: Date):
    day = db.query(MarkedDay).filter(MarkedDay.date == date).first()
    if day:
        db.delete(day); db.commit()
        return None
    day = MarkedDay(date=date)
    db.add(day); db.commit(); db.refresh(day)
    return day