import React, { useState } from 'react';
import { useNavigate, Link } from '../react-router-dom';

import { setToken } from '../auth';
import aestheticImg from '../assets/illustration/aesthetic.png';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        setError(body || 'Login failed');
        return;
      }

      const data = await res.json();
      setToken(data.access_token);
      navigate('/');
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <Link className="auth-home" to="/">← back home</Link>

      <div className="auth-panel">
        <section className="auth-visual" aria-hidden="true">
          <div className="auth-tag">welcome back</div>
          <img src={aestheticImg} alt="" />
        </section>

        <section className="auth-card">
          <div className="auth-heading">
            <span className="auth-kicker">cafe to-do</span>
            <h1>Log in</h1>
            <p>Pick up where you left off.</p>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            <label>
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your username"
                autoComplete="username"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="your password"
                autoComplete="current-password"
                required
              />
            </label>

            {error ? <div className="auth-error">{error}</div> : null}

            <button className="auth-submit" disabled={loading} type="submit">
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="auth-switch">
            No account? <Link to="/signup">Sign up</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
