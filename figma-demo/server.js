/**
 * server.js — lightweight dev/prod server for AdRate
 *
 * Serves static files from ./dist  and  ./public
 * Exposes PUT /api/db  →  writes the full app state back to public/db.json
 *
 * Usage:
 *   node server.js          (default port 3000)
 *   PORT=5173 node server.js
 */

import express from 'express';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const DB_PATH = resolve(__dirname, 'public', 'db.json');

const app = express();
app.use(express.json({ limit: '2mb' }));

// ── PUT /api/db ─────────────────────────────────────────────────────────────
// Accepts the full app state and writes it back to public/db.json
app.put('/api/db', (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Body must be a JSON object' });
    }
    writeFileSync(DB_PATH, JSON.stringify(payload, null, 2), 'utf8');
    console.log(`[db] Written to public/db.json (${JSON.stringify(payload).length} bytes)`);
    return res.json({ ok: true });
  } catch (err) {
    console.error('[db] Write error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ── GET /db.json ─────────────────────────────────────────────────────────────
// Always read from the live public/db.json (not a cached copy)
app.get('/db.json', (_req, res) => {
  try {
    const data = readFileSync(DB_PATH, 'utf8');
    res.type('application/json').send(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not read db.json' });
  }
});

// ── Static files ─────────────────────────────────────────────────────────────
// Serve built assets from dist/, fallback to index.html for SPA routing
app.use(express.static(resolve(__dirname, 'dist')));
app.get('*', (_req, res) => {
  res.sendFile(resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AdRate server running → http://localhost:${PORT}`);
  console.log(`db.json path          → ${DB_PATH}`);
});
