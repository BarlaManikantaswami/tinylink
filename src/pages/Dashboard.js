import React, { useEffect, useState } from 'react';
import { fetchLinks, createLink, deleteLink } from '../api';
import { Link as RouterLink } from 'react-router-dom';
import useClipboard from '../utils/useClipboard';

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

function Dashboard() {
  const [links, setLinks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ target: '', code: '' });
  const [formError, setFormError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState('');
  const { copyText, copied } = useClipboard();

  async function load() {
    setLoading(true);
    try {
      const data = await fetchLinks();
      setLinks(data);
    } catch (e) {
      console.error(e);
      setLinks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onCreate(e) {
    e.preventDefault();
    setFormError(null);
    if (!form.target) return setFormError('Please enter a target URL.');
    try {
      new URL(form.target);
    } catch {
      return setFormError('Invalid URL. Include http:// or https://');
    }
    if (form.code && !CODE_REGEX.test(form.code)) {
      return setFormError('Custom code must match [A-Za-z0-9]{6,8}');
    }
    setCreating(true);
    try {
      const payload = { target: form.target.trim(), code: form.code ? form.code.trim() : undefined };
      const res = await createLink(payload);
      setForm({ target: '', code: '' });
      await load();
    } catch (err) {
      if (err.status === 409) setFormError(err.body?.error || 'Code already exists.');
      else setFormError(err.body?.error || 'Failed to create link.');
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(code) {
    if (!window.confirm(`Delete link ${code}? This cannot be undone.`)) return;
    try {
      await deleteLink(code);
      await load();
    } catch (e) {
      alert('Delete failed');
    }
  }

  const filtered = (links || []).filter(l =>
    l.code.toLowerCase().includes(query.toLowerCase()) ||
    l.target.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="dashboard">
      <section className="panel">
        <h2>Create short link</h2>
        <form onSubmit={onCreate} className="form-row">
          <div className="form-group flex-2">
            <label>Target URL</label>
            <input
              type="url"
              placeholder="https://example.com/very/long/url"
              value={form.target}
              onChange={e => setForm({ ...form, target: e.target.value })}
              disabled={creating}
            />
          </div>
          <div className="form-group">
            <label>Custom code (optional)</label>
            <input
              type="text"
              placeholder="6-8 chars"
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value })}
              disabled={creating}
            />
          </div>
          <div className="form-actions">
            <button className="btn primary" type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
        {formError && <div className="error">{formError}</div>}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Links</h2>
          <div>
            <input
              placeholder="Search by code or URL"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : !links || links.length === 0 ? (
          <div className="empty">No links yet — create one above.</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Short</th>
                  <th>Target</th>
                  <th>Clicks</th>
                  <th>Last Clicked</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
                  <tr key={l.code}>
                    <td>
                      <a className="short-link" href={`${process.env.REACT_APP_BASE_URL || ''}/${l.code}`} target="_blank" rel="noreferrer">
                        {l.code}
                      </a>
                    </td>
                    <td className="target-cell" title={l.target}>
                      <a href={l.target} target="_blank" rel="noreferrer">{truncate(l.target, 80)}</a>
                    </td>
                    <td>{l.clicks}</td>
                    <td>{l.lastClickedAt ? new Date(l.lastClickedAt).toLocaleString() : '—'}</td>
                    <td>
                      <RouterLink to={`/code/${encodeURIComponent(l.code)}`} className="btn small">Stats</RouterLink>
                      <button className="btn small" onClick={() => copyText(`${process.env.REACT_APP_BASE_URL || ''}/${l.code}`)}>
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button className="btn small danger" onClick={() => onDelete(l.code)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function truncate(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

export default Dashboard;
