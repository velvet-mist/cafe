import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import illustrations from assets
import aestheticImg from './assets/illustration/aesthetic.png';
import cherriImg from './assets/illustration/i-cherr-ish.png';
import yearlyImg from './assets/illustration/yearly.png';
import pImg from './assets/illustration/p.png';
import musicImg from './assets/illustration/music.png';
import iceBearImg from './assets/illustration/ice-bear.png';
import angryImg from './assets/illustration/angry-typing.png';

// Import page components
import DailyPlanner from './components/DailyPlanner';
import YearlyPlanner from './components/YearlyPlanner';
import StudyPlanner from './components/StudyPlanner';
import MusicList from './components/MusicList';
import DailyStory from './components/DailyStory';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';
console.log('[frontend] API_BASE', API_BASE);
const API = `${API_BASE}/api/v1/planner`;

// Page card data for the home page
const plannerPages = [
  {
    id: 1,
    name: 'Daily Planner',
    description: 'Schedule your day, jot notes, and stay on track.',
    image: cherriImg,
    href: '/daily',
  },
  {
    id: 2,
    name: 'Yearly Planner',
    description: "Bird's-eye view of all 12 months at a glance.",
    image: yearlyImg,
    href: '/yearly',
  },
  {
    id: 3,
    name: 'Study Planner',
    description: 'Assignments, class schedule, and important notes.',
    image: pImg,
    href: '/study',
  },
  {
    id: 4,
    name: 'Music List',
    description: 'Your favourite songs and artists, all in one spot.',
    image: musicImg,
    href: '/music',
  },
  {
    id: 5,
    name: 'Travel Wishlist',
    description: 'Places to visit and activities to do someday.',
    image: iceBearImg,
    href: 'pages/travel.html',
  },
  {
    id: 6,
    name: 'Daily Story',
    description: 'A free-write journal for your everyday moments.',
    image: angryImg,
    href: '/story',
  },
];

// Home page component
function Home() {
  const [quickTasks, setQuickTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadQuickTasks();
  }, []);

  const loadQuickTasks = async () => {
    try {
      const res = await fetch(`${API}/daily/tasks?date=${today}`);
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        console.error('[QuickTasks] backend error', res.status, body);
        setQuickTasks([]);
        return;
      }
      const data = await res.json();
      setQuickTasks(data.slice(0, 5)); // Only show first 5 tasks
    } catch (e) {
      console.error('[QuickTasks] fetch failed', e);
      setQuickTasks([]);
    }
  };

  const addQuickTask = async () => {
    if (!newTask.trim()) return;
    await fetch(`${API}/daily/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: today, text: newTask.trim() })
    });
    setNewTask('');
    loadQuickTasks();
  };

  const toggleQuickTask = async (id, done) => {
    await fetch(`${API}/daily/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done })
    });
    loadQuickTasks();
  };

  const deleteQuickTask = async (id) => {
    await fetch(`${API}/daily/tasks/${id}`, { method: 'DELETE' });
    loadQuickTasks();
  };

  const completedCount = quickTasks.filter(t => t.done).length;
  const totalCount = quickTasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="App">
      {/* HERO SECTION */}
      <div className="hero fade-up">
        <div className="hero-tag">☕ my cozy corner</div>
        <h1>
          My <span>Planner</span>
        </h1>
        <p>A little cafe for your thoughts, tasks, and dreams.</p>
        <div className="hero-illo">
          <img
            className="card-icon"
            src={aestheticImg}
            alt="Aesthetic illustration"
            width="1000"
            height="200"
          />
        </div>
      </div>

      {/* QUICK TODO + COFFEE PROGRESS */}
      <div className="quick-todo-section">
        <div className="coffee-cup-container">
          <div className="coffee-cup">
            <div className="coffee-liquid" style={{ height: `${progress}%` }}></div>
          </div>
          <div className="coffee-label">
            {completedCount}/{totalCount} ☕
          </div>
        </div>
        <div className="quick-todo-list">
          <div className="quick-todo-header">Today's Quick Tasks</div>
          <div className="quick-todo-input">
            <input
              type="text"
              placeholder="add a quick task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addQuickTask()}
            />
            <button className="add-btn-small" onClick={addQuickTask}>+</button>
          </div>
          <ul className="quick-todo-items">
            {quickTasks.length === 0 ? (
              <li className="quick-todo-empty">no tasks yet — add one!</li>
            ) : (
              quickTasks.map(t => (
                <li key={t.id} className={`quick-todo-item ${t.done ? 'done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleQuickTask(t.id, !t.done)}
                  />
                  <span>{t.text}</span>
                  <button className="del-small" onClick={() => deleteQuickTask(t.id)}>✕</button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* PAGE CARDS GRID */}
      <div className="planner-grid stagger">
        {plannerPages.map((page) => (
          <a key={page.id} className="page-card" href={page.href}>
            <img className="card-icon" src={page.image} alt={page.name} />
            <div className="card-name">{page.name}</div>
            <div className="card-desc">{page.description}</div>
            <span className="card-arrow">→</span>
          </a>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="site-footer">
        <span className="hearts">♡ ☕ ♡</span>
        make every day a cozy one
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily" element={<DailyPlanner />} />
        <Route path="/yearly" element={<YearlyPlanner />} />
        <Route path="/study" element={<StudyPlanner />} />
        <Route path="/music" element={<MusicList />} />
        <Route path="/story" element={<DailyStory />} />
      </Routes>
    </Router>
  );
}

export default App;
