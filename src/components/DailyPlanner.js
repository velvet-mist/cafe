import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';
const API = `${API_BASE}/api/v1/planner`;

function DailyPlanner() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState('');
  const [newTask, setNewTask] = useState('');
  const [schedule, setSchedule] = useState({});

  const timeSlots = [
    '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'
  ];

  useEffect(() => {
    loadDay();
  }, [date]);

  const loadDay = async () => {
    await Promise.all([loadTasks(), loadNotes(), loadSchedule()]);
  };

  const loadTasks = async () => {
    try {
      const res = await fetch(`${API}/daily/tasks?date=${date}`);
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      setTasks([]);
    }
  };

  const loadNotes = async () => {
    try {
      const res = await fetch(`${API}/daily/notes?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data ? data.body : '');
      }
    } catch (e) {
      setNotes('');
    }
  };

  const loadSchedule = async () => {
    try {
      const res = await fetch(`${API}/daily/schedule?date=${date}`);
      const data = await res.json();
      const map = {};
      data.forEach(s => map[s.hour] = s.text);
      setSchedule(map);
    } catch (e) {
      setSchedule({});
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    await fetch(`${API}/daily/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, text: newTask.trim() })
    });
    setNewTask('');
    loadTasks();
  };

  const toggleTask = async (id, done) => {
    await fetch(`${API}/daily/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done })
    });
    loadTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/daily/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
  };

  const saveNotes = async () => {
    await fetch(`${API}/daily/notes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, body: notes })
    });
  };

  const saveSchedule = async () => {
    await Promise.all(timeSlots.map(hour =>
      fetch(`${API}/daily/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, hour, text: schedule[hour] || '' })
      })
    ));
  };

  const handleScheduleChange = (hour, value) => {
    setSchedule(prev => ({ ...prev, [hour]: value }));
  };

  return (
    <div className="page fade-up">
      <Link className="back-nav" to="/">← back</Link>
      <div className="page-header">
        <div>
          <h1>📋 Daily Planner</h1>
          <div className="subtitle">one day at a time</div>
        </div>
      </div>

      <div className="date-bar">
        <span className="pill-label">📅</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title dots">tasks</div>
          <div className="task-input-row">
            <input
              type="text"
              placeholder="add a task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button className="add-btn" onClick={addTask}>+</button>
          </div>
          <ul className="task-list">
            {tasks.length === 0 ? (
              <li style={{ color: 'var(--muted)', fontSize: '0.8rem', textAlign: 'center', padding: '12px' }}>
                no tasks yet
              </li>
            ) : (
              tasks.map(t => (
                <li key={t.id} className={`task-item ${t.done ? ' done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTask(t.id, !t.done)}
                  />
                  <span>{t.text}</span>
                  <button className="del" onClick={() => deleteTask(t.id)}>✕</button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="card">
          <div className="card-title dots">notes</div>
          <div className="notes-block" style={{ minHeight: '180px' }}>
            <textarea
              id="notes-textarea"
              placeholder="jot anything down..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="save-bar">
            <button className="btn" onClick={saveNotes}>save notes</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <div className="card">
          <div className="card-title dots">schedule</div>
          <div className="schedule-grid">
            {timeSlots.map(hour => (
              <div key={hour} className="time-slot">
                <span className="time-label">{hour}</span>
                <input
                  data-hour={hour}
                  type="text"
                  placeholder={hour === '12pm' ? 'lunch 🍱' : hour === '6pm' ? 'evening ☕' : ''}
                  value={schedule[hour] || ''}
                  onChange={(e) => handleScheduleChange(hour, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="save-bar">
            <button className="btn" onClick={saveSchedule}>save schedule</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyPlanner;
