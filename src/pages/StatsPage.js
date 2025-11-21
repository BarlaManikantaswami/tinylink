import React, { useEffect, useState } from 'react';
import { getLink } from '../api';
import { useParams, Link } from 'react-router-dom';

export default function StatsPage() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getLink(code);
        setLink(data);
      } catch (e) {
        setError(e.status === 404 ? 'Link not found' : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [code]);

  if (loading) return <div className="loading">Loading stats...</div>;
  if (error) return <div className="error">{error} — <Link to="/">Back</Link></div>;

  return (
    <div className="panel">
      <h2>Stats for <code>{link.code}</code></h2>
      <ul className="stats-list">
        <li><strong>Target:</strong> <a href={link.target} target="_blank" rel="noreferrer">{link.target}</a></li>
        <li><strong>Clicks:</strong> {link.clicks}</li>
        <li><strong>Created:</strong> {new Date(link.createdAt).toLocaleString()}</li>
        <li><strong>Last clicked:</strong> {link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleString() : '—'}</li>
      </ul>

      <div className="panel-actions">
        <Link to="/" className="btn">Back to dashboard</Link>
      </div>
    </div>
  );
}
