import React, { useState } from 'react';
import { useNavigate, Link } from '../react-router-dom';

import { setToken } from '../auth';

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
    <div className="App" style={{ maxWidth: 420, margin: '40px auto', padding: 16 }}>
      <h2 style={{ marginBottom: 8 }}>Log in</h2>
      <p style={{ marginTop: 0, opacity: 0.8 }}>Use your username + password.</p>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          autoComplete="username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          autoComplete="current-password"
          required
        />
        {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}
        <button disabled={loading} type="submit" style={{ padding: 10, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <div style={{ marginTop: 14, opacity: 0.85 }}>
        No account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}

