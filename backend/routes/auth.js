const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const auth = require('../middleware/auth');

function sign(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii.' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Parola trebuie să aibă cel puțin 6 caractere.' });

    const exists = await db.query('SELECT id FROM users WHERE email=$1', [email.toLowerCase()]);
    if (exists.rows.length)
      return res.status(409).json({ error: 'Există deja un cont cu acest email.' });

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      'INSERT INTO users (name,email,password_hash,is_approved) VALUES($1,$2,$3,FALSE) RETURNING id,name,email',
      [name.trim(), email.toLowerCase(), hash]
    );

    // NU mai trimitem token-ul aici. Trimitem doar un mesaj de succes.
    res.status(201).json({
      message: 'Cont creat! Așteaptă aprobarea unui administrator pentru a te putea loga.',
      user: rows[0]
    });
  } catch (e) { next(e); }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await db.query(
      'SELECT * FROM users WHERE email=$1', [email?.toLowerCase()]
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'Email sau parolă incorectă.' });

    if (!user.is_approved)
      return res.status(403).json({ error: 'Contul tău așteaptă aprobarea unui administrator. Te rugăm să revii mai târziu.' });

    const { password_hash: _, ...safe } = user;
    res.json({ token: sign(safe), user: safe, force_password_reset: user.force_password_reset });
  } catch (e) { next(e); }
});

router.get('/me', auth, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, email, role, tries, is_approved, force_password_reset, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Utilizator inexistent.' });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/change-password  (requires auth)
router.post('/change-password', auth, async (req, res, next) => {
  try {
    const { new_password } = req.body;
    if (!new_password || new_password.length < 6)
      return res.status(400).json({ error: 'Parola trebuie să aibă cel puțin 6 caractere.' });

    const hash = await bcrypt.hash(new_password, 10);
    await db.query(
      'UPDATE users SET password_hash=$1, force_password_reset=FALSE WHERE id=$2',
      [hash, req.user.id]
    );
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
