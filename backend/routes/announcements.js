const router = require('express').Router();
const db     = require('../db');
const auth   = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

// GET /api/announcements  (public)
router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM announcements ORDER BY pinned DESC, created_at DESC'
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// POST /api/announcements  [admin]
router.post('/', auth, requireAdmin, async (req, res, next) => {
  try {
    const { title, body, pinned } = req.body;
    if (!title?.trim() || !body?.trim())
      return res.status(400).json({ error: 'Titlul și conținutul sunt obligatorii.' });

    const { rows } = await db.query(
      'INSERT INTO announcements (title,body,pinned,author) VALUES($1,$2,$3,$4) RETURNING *',
      [title.trim(), body.trim(), !!pinned, req.user.name]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// PATCH /api/announcements/:id  [admin]
router.patch('/:id', auth, requireAdmin, async (req, res, next) => {
  try {
    const { title, body, pinned } = req.body;
    const { rows } = await db.query(
      'UPDATE announcements SET title=COALESCE($1,title), body=COALESCE($2,body), pinned=COALESCE($3,pinned) WHERE id=$4 RETURNING *',
      [title, body, pinned, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Anunț negăsit.' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// DELETE /api/announcements/:id  [admin]
router.delete('/:id', auth, requireAdmin, async (req, res, next) => {
  try {
    await db.query('DELETE FROM announcements WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
