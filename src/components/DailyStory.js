import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:8000/api/v1/planner';

const MOODS = [
  { emoji: '😊', label: 'happy' },
  { emoji: '😌', label: 'calm' },
  { emoji: '😔', label: 'sad' },
  { emoji: '😤', label: 'stressed' },
  { emoji: '🥱', label: 'tired' },
  { emoji: '🤩', label: 'excited' }
];

function DailyStory() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState('');
  const [body, setBody] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    loadEntry();
  }, [date]);

  const loadEntry = async () => {
    try {
      const res = await fetch(`${API}/story?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setBody(data.body || '');
          setMood(data.mood || '');
          const words = (data.body || '').trim().split(/\s+/).filter(Boolean).length;
          setWordCount(words);
        } else {
          setBody('');
          setMood('');
          setWordCount(0);
        }
      }
    } catch (e) {
      setBody('');
      setMood('');
      setWordCount(0);
    }
  };

  const setMoodByBtn = (moodLabel) => {
    setMood(moodLabel);
  };

  const handleBodyChange = (e) => {
    const value = e.target.value;
    setBody(value);
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  };

  const saveEntry = async () => {
    await fetch(`${API}/story`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, mood, body })
    });
    setStatus(true);
    setTimeout(() => setStatus(false), 2000);
  };

  return (
    <div className="page fade-up">
      <Link className="back-nav" to="/">← back</Link>
      <div className="page-header">
        <div>
          <h1>🌸 Daily Story</h1>
          <div className="subtitle">write it down, let it go</div>
        </div>
      </div>

      <div className="journal-date">
        <span className="pill-label">📅 date</span>
        <input
          type="date"
          id="journal-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <div className="card-title dots">how are you feeling?</div>
        <div className="mood-row" id="mood-row">
          {MOODS.map(m => (
            <button
              key={m.label}
              className={`mood-btn ${mood === m.label ? 'active' : ''}`}
              onClick={() => setMoodByBtn(m.label)}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-title dots">today's story</div>
      <div className="journal-body">
        <textarea
          id="journal-text"
          placeholder="dear diary, today was..."
          value={body}
          onChange={handleBodyChange}
        />
      </div>

      <div className="bottom-row">
        <span className="word-count" id="word-count">{wordCount} words</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className={`status ${status ? 'show' : ''}`}>saved ✓</span>
          <button className="btn" onClick={saveEntry}>save ☕</button>
        </div>
      </div>
    </div>
  );
}

export default DailyStory;
