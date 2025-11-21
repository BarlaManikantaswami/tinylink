require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// CommonJS-friendly nanoid v3
const { nanoid } = require('nanoid');

// CommonJS-compatible lowdb v1
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// ENV
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data', 'db.json');

// APP
const app = express();
app.use(cors());
app.use(express.json());

// Ensure data folder exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Setup lowdb (v1)
const adapter = new FileSync(DATA_FILE);
const db = low(adapter);

// Initial structure
db.defaults({ links: [] }).write();

// Helpers
function validCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

function validateUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

// Health check
app.get('/healthz', (req, res) => {
  res.json({ ok: true, version: "1.0", uptime: process.uptime() });
});

// CREATE LINK
app.post('/api/links', (req, res) => {
  const { target, code: requestedCode } = req.body || {};

  if (!target || !validateUrl(target)) {
    return res.status(400).json({ error: 'Invalid target URL. Must be http(s).' });
  }

  const links = db.get('links').value();

  let code = requestedCode;

  if (code) {
    if (!validCode(code)) {
      return res.status(400).json({ error: 'Invalid code format [A-Za-z0-9]{6,8}' });
    }

    const exists = links.find(l => l.code.toLowerCase() === code.toLowerCase());
    if (exists) {
      return res.status(409).json({ error: 'Code already exists.' });
    }
  } else {
    // auto-generate code until unique
    do {
      code = nanoid(7);
    } while (links.find(l => l.code === code));
  }

  const now = new Date().toISOString();
  
  const newLink = {
    code,
    target,
    createdAt: now,
    clicks: 0,
    lastClickedAt: null
  };

  db.get('links').push(newLink).write();

  res.status(201).json(newLink);
});

// LIST LINKS
app.get('/api/links', (req, res) => {
  const links = db.get('links').value();
  res.json(links);
});

// GET SINGLE LINK
app.get('/api/links/:code', (req, res) => {
  const code = req.params.code;

  const link = db.get('links')
    .find(l => l.code.toLowerCase() === code.toLowerCase())
    .value();

  if (!link) return res.status(404).json({ error: 'Not found' });

  res.json(link);
});

// DELETE LINK
app.delete('/api/links/:code', (req, res) => {
  const code = req.params.code;

  const exists = db.get('links')
    .find(l => l.code.toLowerCase() === code.toLowerCase())
    .value();

  if (!exists) return res.status(404).json({ error: 'Not found' });

  db.get('links')
    .remove(l => l.code.toLowerCase() === code.toLowerCase())
    .write();

  res.status(204).send();
});

// REDIRECT
app.get('/:code', (req, res, next) => {
  const code = req.params.code;

  if (['api', 'healthz', ''].includes(code)) return next();

  const link = db.get('links')
    .find(l => l.code.toLowerCase() === code.toLowerCase())
    .value();

  if (!link) return res.status(404).send('Not found');

  db.get('links')
    .find({ code })
    .assign({
      clicks: (link.clicks || 0) + 1,
      lastClickedAt: new Date().toISOString()
    })
    .write();

  return res.redirect(302, link.target);
});

// SERVE FRONTEND (optional)
const buildPath = path.join(__dirname, '..', 'frontend', 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// START SERVER
app.listen(PORT, () => {
  console.log(`TinyLink backend running at ${BASE_URL}`);
});
