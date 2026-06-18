const express = require('express');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const { pool } = require('../postgres');
const { signToken } = require('../auth');
const { validate } = require('../middlewares');

const router = express.Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register new user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [USER, ADMIN] }
 *     responses:
 *       201: { description: Created }
 */
router.post(
  '/register',
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  validate,
  async (req, res) => {
    const { name, email, password, role } = req.body;
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length) return res.status(409).json({ error: 'Email already used' });

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hash, role === 'ADMIN' ? 'ADMIN' : 'USER']
    );
    res.status(201).json(result.rows[0]);
  }
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and get JWT
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.post(
  '/login',
  body('email').isEmail(),
  body('password').isString().notEmpty(),
  validate,
  async (req, res) => {
    const { email, password } = req.body;
    const result = await pool.query('SELECT id, name, email, password, role FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }
);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password directly with email and new password
 *     description: Simplified academic flow. In production, use a temporary token sent by email.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               newPassword: { type: string, minLength: 6 }
 *               confirmPassword: { type: string, minLength: 6 }
 *     responses:
 *       200: { description: Password updated }
 *       400: { description: Validation error }
 *       404: { description: User not found }
 */
// Fluxo simplificado para fins academicos. Em producao, o correto seria usar
// token temporario enviado por e-mail.
router.post(
  '/forgot-password',
  body('email').isEmail().withMessage('E-mail invalido'),
  body('newPassword').isLength({ min: 6 }).withMessage('Nova senha precisa de no minimo 6 caracteres'),
  body('confirmPassword').isLength({ min: 6 }).withMessage('Confirmacao precisa de no minimo 6 caracteres'),
  validate,
  async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'As senhas nao coincidem.' });
    }

    const found = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (!found.rows.length) {
      return res.status(404).json({ error: 'Usuario nao encontrado.' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE email = $2 RETURNING id, email', [hash, email]);

    return res.json({ message: 'Senha atualizada com sucesso.' });
  }
);

module.exports = router;
