from sqlalchemy import Column, Integer, String, Boolean, Date, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base


# ── DAILY PLANNER ──
class DailyTask(Base):
    __tablename__ = "daily_tasks"
    id          = Column(Integer, primary_key=True, index=True)
    date        = Column(Date, nullable=False, index=True)
    text        = Column(String(255), nullable=False)
    done        = Column(Boolean, default=False)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())


class DailyScheduleSlot(Base):
    __tablename__ = "daily_schedule_slots"
    id    = Column(Integer, primary_key=True, index=True)
    date  = Column(Date, nullable=False, index=True)
    hour  = Column(String(10), nullable=False)   # e.g. "9am"
    text  = Column(String(255), default="")


class DailyNote(Base):
    __tablename__ = "daily_notes"
    id    = Column(Integer, primary_key=True, index=True)
    date  = Column(Date, nullable=False, unique=True, index=True)
    body  = Column(Text, default="")


# ── DAILY STORY ──
class DailyStory(Base):
    __tablename__ = "daily_stories"
    id    = Column(Integer, primary_key=True, index=True)
    date  = Column(Date, nullable=False, unique=True, index=True)
    mood  = Column(String(50), default="")
    body  = Column(Text, default="")


# ── MUSIC LIST ──
class Song(Base):
    __tablename__ = "songs"
    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String(255), nullable=False)
    artist     = Column(String(255), default="")
    genre      = Column(Text, default="")  # stores full Spotify URL
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ── STUDY PLANNER ──
class Assignment(Base):
    __tablename__ = "assignments"
    id         = Column(Integer, primary_key=True, index=True)
    text       = Column(String(255), nullable=False)
    priority   = Column(String(10), default="mid")   # high | mid | low
    done       = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ClassScheduleSlot(Base):
    __tablename__ = "class_schedule_slots"
    id      = Column(Integer, primary_key=True, index=True)
    day     = Column(String(20), nullable=False)   # e.g. "Monday"
    subject = Column(String(255), default="")
    time    = Column(String(30), default="")


class StudyNote(Base):
    __tablename__ = "study_notes"
    id   = Column(Integer, primary_key=True, index=True)
    body = Column(Text, default="")


# ── YEARLY PLANNER ──
class MarkedDay(Base):
    __tablename__ = "marked_days"
    id   = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, unique=True, index=True)