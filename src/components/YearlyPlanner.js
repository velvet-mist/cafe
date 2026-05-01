import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:8000/api/v1/planner';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function YearlyPlanner() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [markedSet, setMarkedSet] = useState(new Set());
  const today = new Date();

  useEffect(() => {
    loadMarkedDays();
  }, [currentYear]);

  const loadMarkedDays = async () => {
    try {
      const res = await fetch(`${API}/yearly?year=${currentYear}`);
      const data = await res.json();
      setMarkedSet(new Set(data.map(d => d.date)));
    } catch (e) {
      setMarkedSet(new Set());
    }
  };

  const changeYear = async (delta) => {
    setCurrentYear(prev => prev + delta);
  };

  const toggleDay = async (dateStr) => {
    try {
      await fetch(`${API}/yearly/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr })
      });
      setMarkedSet(prev => {
        const newSet = new Set(prev);
        if (newSet.has(dateStr)) {
          newSet.delete(dateStr);
        } else {
          newSet.add(dateStr);
        }
        return newSet;
      });
    } catch (e) {
      console.error('Error toggling day:', e);
    }
  };

  const isToday = (month, day) => {
    return today.getFullYear() === currentYear && 
           today.getMonth() === month && 
           today.getDate() === day;
  };

  const renderMonth = (monthIndex) => {
    const firstDay = new Date(currentYear, monthIndex, 1).getDay();
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day-cell empty" />);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(monthIndex + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${currentYear}-${mm}-${dd}`;
      const marked = markedSet.has(dateStr);
      const todayCell = isToday(monthIndex, d);
      
      days.push(
        <div
          key={d}
          className={`day-cell ${marked ? ' marked' : ''} ${todayCell ? ' today' : ''}`}
          onClick={() => toggleDay(dateStr)}
        >
          {d}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="page fade-up">
      <Link className="back-nav" to="/">← back</Link>
      <div className="page-header">
        <div>
          <h1>📅 Yearly Planner</h1>
          <div className="subtitle">the big picture</div>
        </div>
      </div>

      <div className="year-nav">
        <button onClick={() => changeYear(-1)}>‹</button>
        <span className="year-label">{currentYear}</span>
        <button onClick={() => changeYear(1)}>›</button>
      </div>

      <div className="months-grid">
        {MONTHS.map((name, index) => (
          <div key={name} className="month-card">
            <div className="month-name">{name}</div>
            <div className="day-grid">
              {DAYS.map(d => (
                <div key={d} className="day-hdr">{d}</div>
              ))}
              {renderMonth(index)}
            </div>
          </div>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--accent)' }}></div>
          marked day
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ border: '1.5px solid var(--accent)', background: 'transparent' }}></div>
          today
        </div>
      </div>
    </div>
  );
}

export default YearlyPlanner;
