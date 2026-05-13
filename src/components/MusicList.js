import React, { useState, useEffect } from 'react';
import { Link } from '../react-router-dom';


const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';
const API = `${API_BASE}/api/v1/planner`;

function MusicList() {
  const [songs, setSongs] = useState([]);
  const [linkInput, setLinkInput] = useState('');
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(false);
  const [openEmbeds, setOpenEmbeds] = useState({});

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const res = await fetch(`${API}/music`);
      const data = await res.json();
      setSongs(data);
    } catch (e) {
      setSongs([]);
    }
  };

  const extractTrackId = (url) => {
    const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const fetchTrackMeta = async (trackId) => {
    try {
      const url = `https://open.spotify.com/track/${trackId}`;
      const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return { title: data.title, artist: data.author_name || '' };
    } catch {
      return null;
    }
  };

  const addSong = async () => {
    const link = linkInput.trim();
    const trackId = extractTrackId(link);
    
    if (!trackId) {
      setError('⚠ paste a valid spotify track URL');
      return;
    }

    setFetching(true);
    const meta = await fetchTrackMeta(trackId);
    setFetching(false);

    const title = meta ? meta.title : `Track ${trackId}`;
    const artist = meta ? meta.artist : '';

    await fetch(`${API}/music`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, artist, genre: link })
    });

    setLinkInput('');
    loadSongs();
  };

  const deleteSong = async (id) => {
    await fetch(`${API}/music/${id}`, { method: 'DELETE' });
    loadSongs();
  };

  const toggleEmbed = (id) => {
    setOpenEmbeds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="page fade-up">
      <Link className="back-nav" to="/">← back</Link>
      <div className="page-header">
        <div>
          <h1>🎵 Music List</h1>
          <div className="subtitle">your personal soundtrack</div>
        </div>
      </div>

      <div className="card">
        <div className="add-row">
          <input
            type="text"
            id="link-input"
            placeholder="paste spotify track link and press enter..."
            value={linkInput}
            onChange={(e) => {
              setLinkInput(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && addSong()}
            style={error ? { borderColor: '#c0392b' } : {}}
          />
          <button className="btn" onClick={addSong}>+ add</button>
        </div>
        <div className="hint">e.g. https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT</div>
        {error && <div className="error-msg show">{error}</div>}
        {fetching && (
          <div className="loading-pill">⏳ fetching track info...</div>
        )}

        <div className="song-list">
          {songs.length === 0 ? (
            <div className="empty-state">no songs yet — paste a spotify link above ☕</div>
          ) : (
            songs.map((s, i) => {
              const trackId = extractTrackId(s.genre);
              return (
                <div key={s.id} className="song-card">
                  <div className="song-card-header">
                    <span className="song-num">{i + 1}</span>
                    <div className="song-info">
                      <div className="song-title">{s.title}</div>
                      <div className="song-meta">{s.artist || ''}</div>
                    </div>
                    {trackId && (
                      <button
                        className="toggle-embed"
                        onClick={() => toggleEmbed(s.id)}
                      >
                        {openEmbeds[s.id] ? '▼ hide' : '▶ play'}
                      </button>
                    )}
                    <button className="del" onClick={() => deleteSong(s.id)}>✕</button>
                  </div>
                  {trackId && (
                    <div className={`embed-wrap ${openEmbeds[s.id] ? 'open' : ''}`}>
                      <iframe
                        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
                        title={`Spotify player for ${s.title}`}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default MusicList;
