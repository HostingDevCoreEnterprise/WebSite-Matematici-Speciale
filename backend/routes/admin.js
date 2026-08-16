const router = require('express').Router();
const db     = require('../db');
const auth   = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(auth, requireAdmin);

// GET /api/admin/users
router.get('/users', async (_req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT u.id, u.name, u.email, u.role, u.tries, u.is_approved, u.created_at,
        COALESCE(json_agg(r ORDER BY r.created_at DESC) FILTER (WHERE r.id IS NOT NULL), '[]') AS mock_results
      FROM users u
      LEFT JOIN mock_results r ON r.user_id = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    res.json(rows);
  } catch (e) { next(e); }
});

// PATCH /api/admin/users/:id
router.patch('/users/:id', async (req, res, next) => {
  try {
    const { tries, role, is_approved } = req.body;
    const updates = [];
    const params  = [];

    if (tries !== undefined) { params.push(tries); updates.push(`tries=$${params.length}`); }
    if (role  !== undefined) { params.push(role);  updates.push(`role=$${params.length}`); }
    if (is_approved !== undefined) { params.push(is_approved); updates.push(`is_approved=$${params.length}`); }

    if (!updates.length) return res.status(400).json({ error: 'Nicio modificare furnizată.' });

    params.push(req.params.id);
    const { rows } = await db.query(
      `UPDATE users SET ${updates.join(',')} WHERE id=$${params.length} RETURNING id,name,email,role,tries`,
      params
    );
    if (!rows[0]) return res.status(404).json({ error: 'Utilizator negăsit.' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// POST /api/admin/users/:id/reset-password
router.post('/users/:id/reset-password', async (req, res, next) => {
  try {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    const newPassword = Array.from({ length: 10 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');

    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash(newPassword, 10);

    const { rows } = await db.query(
      'UPDATE users SET password_hash=$1, force_password_reset=TRUE WHERE id=$2 RETURNING id, name, email',
      [hash, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Utilizator negăsit.' });

    res.json({ ok: true, user: rows[0], new_password: newPassword });
  } catch (e) { next(e); }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res, next) => {
  try {
    if (String(req.params.id) === String(req.user.id))
      return res.status(400).json({ error: 'Nu te poți șterge pe tine.' });
    await db.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// GET /api/admin/mock-results  (all results with user info)
router.get('/mock-results', async (_req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT r.*, 
             u.name AS user_name, u.email AS user_email,
             t.title AS theory_title, 
             e.title AS exercise_title
      FROM mock_results r
      JOIN users u ON u.id = r.user_id
      LEFT JOIN mock_subjects_theory t ON t.id::text = r.theory_subject
      LEFT JOIN mock_subjects_exercise e ON e.id::text = r.exercise_subject
      ORDER BY r.created_at DESC
    `);
    res.json(rows);
  } catch (e) { next(e); }
});

// POST /api/admin/grade/:resultId
router.post('/grade/:resultId', async (req, res, next) => {
  try {
    const { grade, comment } = req.body;
    if (grade === undefined || grade < 0 || grade > 10)
      return res.status(400).json({ error: 'Nota trebuie să fie între 0 și 10.' });

    const { rows } = await db.query(
      'UPDATE mock_results SET admin_grade=$1, admin_comment=$2 WHERE id=$3 RETURNING *',
      [parseFloat(grade), comment || null, req.params.resultId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Rezultat negăsit.' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

module.exports = router;
