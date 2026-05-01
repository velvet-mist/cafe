import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:8000/api/v1/planner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function StudyPlanner() {
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState('');
  const [priority, setPriority] = useState('mid');
  const [studyNotes, setStudyNotes] = useState('');
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadAssignments(), loadSchedule(), loadNotes()]);
  };

  const loadAssignments = async () => {
    try {
      const res = await fetch(`${API}/study/assignments`);
      const data = await res.json();
      setAssignments(data);
    } catch (e) {
      setAssignments([]);
    }
  };

  const loadSchedule = async () => {
    try {
      const res = await fetch(`${API}/study/schedule`);
      const data = await res.json();
      const map = {};
      data.forEach(s => map[s.day] = s);
      setSchedule(map);
    } catch (e) {
      setSchedule({});
    }
  };

  const loadNotes = async () => {
    try {
      const res = await fetch(`${API}/study/notes`);
      if (res.ok) {
        const data = await res.json();
        setStudyNotes(data ? data.body : '');
      }
    } catch (e) {
      setStudyNotes('');
    }
  };

  const addAssignment = async () => {
    if (!newAssignment.trim()) return;
    await fetch(`${API}/study/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newAssignment.trim(), priority })
    });
    setNewAssignment('');
    loadAssignments();
  };

  const toggleAssignment = async (id, done) => {
    await fetch(`${API}/study/assignments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done })
    });
    loadAssignments();
  };

  const deleteAssignment = async (id) => {
    await fetch(`${API}/study/assignments/${id}`, { method: 'DELETE' });
    loadAssignments();
  };

  const saveSchedule = async () => {
    await Promise.all(DAYS.map(async day => {
      const subject = schedule[day]?.subject || '';
      const time = schedule[day]?.time || '';
      return fetch(`${API}/study/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, subject, time })
      });
    }));
  };

  const saveNotes = async () => {
    await fetch(`${API}/study/notes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: studyNotes })
    });
  };

  const handleScheduleChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  return (
    <div className="page fade-up">
      <Link className="back-nav" to="/">← back</Link>
      <div className="page-header">
        <div>
          <h1>✏️ Study Planner</h1>
          <div className="subtitle">stay ahead of the curve</div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title dots">assignments</div>
          <div className="assignment-input">
            <input
              type="text"
              placeholder="assignment name..."
              value={newAssignment}
              onChange={(e) => setNewAssignment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addAssignment()}
            />
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="high">🔴 high</option>
              <option value="mid">🟡 mid</option>
              <option value="low">🟢 low</option>
            </select>
            <button className="add-btn" onClick={addAssignment}>+</button>
          </div>
          <ul className="assignment-list">
            {assignments.length === 0 ? (
              <li style={{ color: 'var(--muted)', fontSize: '0.8rem', textAlign: 'center', padding: '16px' }}>
                no assignments yet ☕
              </li>
            ) : (
              assignments.map(a => (
                <li key={a.id} className={`assignment-item ${a.done ? ' done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={a.done}
                    onChange={() => toggleAssignment(a.id, !a.done)}
                  />
                  <span className="text">{a.text}</span>
                  <span className={`priority-badge priority-${a.priority}`}>
                    {a.priority}
                  </span>
                  <button className="del" onClick={() => deleteAssignment(a.id)}>✕</button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="card">
          <div className="card-title dots">class schedule</div>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>day</th>
                <th>subject</th>
                <th>time</th>
              </tr>
            </thead>
            <tbody>
              {DAYS.map(day => (
                <tr key={day}>
                  <td>
                    <input
                      data-day={day}
                      data-field="day"
                      value={day}
                      readOnly
                      style={{ color: 'var(--muted)' }}
                    />
                  </td>
                  <td>
                    <input
                      data-day={day}
                      data-field="subject"
                      placeholder="subject..."
                      value={schedule[day]?.subject || ''}
                      onChange={(e) => handleScheduleChange(day, 'subject', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      data-day={day}
                      data-field="time"
                      placeholder="9:00am"
                      value={schedule[day]?.time || ''}
                      onChange={(e) => handleScheduleChange(day, 'time', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="save-bar">
            <button className="btn" onClick={saveSchedule}>save schedule</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '16px' }}>
        <div className="card-title dots">important notes</div>
        <div className="notes-block">
          <textarea
            id="study-notes"
            placeholder="write reminders, key formulas, or anything important..."
            value={studyNotes}
            onChange={(e) => setStudyNotes(e.target.value)}
          />
        </div>
        <div className="save-bar">
          <button className="btn" onClick={saveNotes}>save notes</button>
        </div>
      </div>
    </div>
  );
}

export default StudyPlanner;
