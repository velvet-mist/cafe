from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional


# ── DAILY TASKS ──
class DailyTaskCreate(BaseModel):
    date: date
    text: str = Field(..., min_length=1, max_length=255)

class DailyTaskUpdate(BaseModel):
    text: Optional[str] = Field(None, min_length=1, max_length=255)
    done: Optional[bool] = None

class DailyTaskResponse(BaseModel):
    id: int
    date: date
    text: str
    done: bool
    created_at: datetime
    model_config = {"from_attributes": True}


# ── DAILY SCHEDULE ──
class ScheduleSlotUpsert(BaseModel):
    date: date
    hour: str
    text: str = ""

class ScheduleSlotResponse(BaseModel):
    id: int
    date: date
    hour: str
    text: str
    model_config = {"from_attributes": True}


# ── DAILY NOTES ──
class DailyNoteUpsert(BaseModel):
    date: date
    body: str = ""

class DailyNoteResponse(BaseModel):
    id: int
    date: date
    body: str
    model_config = {"from_attributes": True}


# ── DAILY STORY ──
class DailyStoryUpsert(BaseModel):
    date: date
    mood: str = ""
    body: str = ""

class DailyStoryResponse(BaseModel):
    id: int
    date: date
    mood: str
    body: str
    model_config = {"from_attributes": True}


# ── MUSIC ──
class SongCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    artist: str = ""
    genre: str = ""  # stores full Spotify URL, no length limit
 
class SongResponse(BaseModel):
    id: int
    title: str
    artist: str
    genre: str
    created_at: datetime
    model_config = {"from_attributes": True}


# ── ASSIGNMENTS ──
class AssignmentCreate(BaseModel):
    text: str = Field(..., min_length=1, max_length=255)
    priority: str = "mid"

class AssignmentUpdate(BaseModel):
    text: Optional[str] = None
    priority: Optional[str] = None
    done: Optional[bool] = None

class AssignmentResponse(BaseModel):
    id: int
    text: str
    priority: str
    done: bool
    created_at: datetime
    model_config = {"from_attributes": True}


# ── CLASS SCHEDULE ──
class ClassSlotUpsert(BaseModel):
    day: str
    subject: str = ""
    time: str = ""

class ClassSlotResponse(BaseModel):
    id: int
    day: str
    subject: str
    time: str
    model_config = {"from_attributes": True}


# ── STUDY NOTES ──
class StudyNoteUpsert(BaseModel):
    body: str = ""

class StudyNoteResponse(BaseModel):
    id: int
    body: str
    model_config = {"from_attributes": True}


# ── YEARLY ──
class MarkedDayToggle(BaseModel):
    date: date

class MarkedDayResponse(BaseModel):
    id: int
    date: date
    model_config = {"from_attributes": True}