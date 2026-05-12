import React, { useState } from 'react';
import { useNavigate, Link } from '../react-router-dom';

import { setToken } from '../auth';
import cherriImg from '../assets/illustration/i-cherr-ish.png';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        setError(body || 'Signup failed');
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
          <div className="auth-tag">new table</div>
          <img src={cherriImg} alt="" />
        </section>

        <section className="auth-card">
          <div className="auth-heading">
            <span className="auth-kicker">cafe to-do</span>
            <h1>Create account</h1>
            <p>No email needed, just a username and password.</p>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            <label>
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="choose a username"
                autoComplete="username"
                required
                minLength={3}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="at least 6 characters"
                autoComplete="new-password"
                required
                minLength={6}
              />
            </label>

            <label>
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="type it once more"
                autoComplete="new-password"
                required
                minLength={6}
              />
            </label>

            {error ? <div className="auth-error">{error}</div> : null}

            <button className="auth-submit" disabled={loading} type="submit">
              {loading ? 'Creating...' : 'Sign up'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
