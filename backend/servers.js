require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://matematicispeciale.site', 'https://dashboard.matematicispeciale.site'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/materials',     require('./routes/materials'));
app.use('/api/mock',          require('./routes/mock'));
app.use('/api/admin',         require('./routes/admin'));

// ── Error handler ─────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
