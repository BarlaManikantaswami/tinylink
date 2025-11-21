const API_BASE = process.env.REACT_APP_API_BASE || '/api';

async function api(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) throw { status: res.status, body: json, text };
    return json;
  } catch (err) {
    if (err.status) throw err;
    // parse failed but status ok
    return text;
  }
}

export function fetchLinks() {
  return api('/links');
}
export function createLink(payload) {
  return api('/links', { method: 'POST', body: JSON.stringify(payload) });
}
export function getLink(code) {
  return api(`/links/${encodeURIComponent(code)}`);
}
export function deleteLink(code) {
  return api(`/links/${encodeURIComponent(code)}`, { method: 'DELETE' });
}
