const router = require('express').Router();
const db     = require('../db');
const auth   = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

// GET /api/mock/theory-subjects  (public)
router.get('/theory-subjects', async (_req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM mock_subjects_theory ORDER BY id');
    res.json(rows);
  } catch (e) { next(e); }
});

// GET /api/mock/exercise-subjects  (public – subjects shown after theory)
router.get('/exercise-subjects', async (_req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM mock_subjects_exercise ORDER BY id');
    res.json(rows);
  } catch (e) { next(e); }
});

// POST /api/mock/subjects/theory  [admin]
router.post('/subjects/theory', auth, requireAdmin, async (req, res, next) => {
  try {
    const { title, link } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Titlul este obligatoriu.' });
    const { rows } = await db.query(
      'INSERT INTO mock_subjects_theory (title,link) VALUES($1,$2) RETURNING *',
      [title.trim(), link?.trim() || '#']
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// POST /api/mock/subjects/exercise  [admin]
router.post('/subjects/exercise', auth, requireAdmin, async (req, res, next) => {
  try {
    const { title, link } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Titlul este obligatoriu.' });
    const { rows } = await db.query(
      'INSERT INTO mock_subjects_exercise (title,link) VALUES($1,$2) RETURNING *',
      [title.trim(), link?.trim() || '#']
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// DELETE /api/mock/subjects/theory/:id  [admin]
router.delete('/subjects/theory/:id', auth, requireAdmin, async (req, res, next) => {
  try {
    await db.query('DELETE FROM mock_subjects_theory WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// DELETE /api/mock/subjects/exercise/:id  [admin]
router.delete('/subjects/exercise/:id', auth, requireAdmin, async (req, res, next) => {
  try {
    await db.query('DELETE FROM mock_subjects_exercise WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// POST /api/mock/submit  [student auth]
router.post('/submit', auth, async (req, res, next) => {
  try {
    const { theory_subject, exercise_subject, upload_url,
            finished_early_theory, finished_early_exercise } = req.body;

    // Decrement tries (skip for admins)
    const { rows: userRows } = await db.query('SELECT * FROM users WHERE id=$1', [req.user.id]);
    const user = userRows[0];
    if (!user) return res.status(404).json({ error: 'Utilizator negăsit.' });

    if (user.role !== 'admin') {
      if (user.tries <= 0)
        return res.status(403).json({ error: 'Nu mai ai încercări disponibile.' });
      await db.query('UPDATE users SET tries = tries - 1 WHERE id=$1', [req.user.id]);
    }

    const { rows } = await db.query(
      `INSERT INTO mock_results
        (user_id, theory_subject, exercise_subject, upload_url,
         finished_early_theory, finished_early_exercise)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.user.id, theory_subject, exercise_subject, upload_url || null,
       !!finished_early_theory, !!finished_early_exercise]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// GET /api/mock/my-results  [auth]
router.get('/my-results', auth, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT r.*, 
              t.title AS theory_title, 
              e.title AS exercise_title
       FROM mock_results r
       LEFT JOIN mock_subjects_theory t ON t.id::text = r.theory_subject
       LEFT JOIN mock_subjects_exercise e ON e.id::text = r.exercise_subject
       WHERE r.user_id = $1 
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) { next(e); }
});

module.exports = router;
