const router = require('express').Router();
const db     = require('../db');
const auth   = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

// GET /api/materials?category=curs  (requires auth)
router.get('/', auth, async (req, res, next) => {
  try {
    const { category } = req.query;
    const q = category
      ? 'SELECT * FROM materials WHERE category=$1 ORDER BY created_at DESC'
      : 'SELECT * FROM materials ORDER BY category, created_at DESC';
    const params = category ? [category] : [];
    const { rows } = await db.query(q, params);
    res.json(rows);
  } catch (e) { next(e); }
});

// POST /api/materials  [admin]
router.post('/', auth, requireAdmin, async (req, res, next) => {
  try {
    const { title, link, category, type } = req.body;
    if (!title?.trim() || !link?.trim() || !category)
      return res.status(400).json({ error: 'Titlul, link-ul și categoria sunt obligatorii.' });

    const { rows } = await db.query(
      'INSERT INTO materials (title,link,category,type) VALUES($1,$2,$3,$4) RETURNING *',
      [title.trim(), link.trim(), category, type || 'PDF']
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// DELETE /api/materials/:id  [admin]
router.delete('/:id', auth, requireAdmin, async (req, res, next) => {
  try {
    await db.query('DELETE FROM materials WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
