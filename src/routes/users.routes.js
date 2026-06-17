const express = require('express');
const bcrypt = require('bcryptjs');
const { body, param } = require('express-validator');
const { pool } = require('../postgres');
const { authRequired, adminOnly, validate } = require('../middlewares');

const router = express.Router();

router.use(authRequired);
router.use(adminOnly);

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List users (ADMIN)
 *     responses:
 *       200: { description: OK }
 */
router.get('/', async (_req, res) => {
  const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY id');
  res.json(result.rows);
});

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by id (ADMIN)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.get('/:id', param('id').isInt(), validate, async (req, res) => {
  const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.params.id]);
  const user = result.rows[0];
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user (ADMIN)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.put(
  '/:id',
  body('name').optional().isString(),
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('role').optional().isIn(['USER', 'ADMIN']),
  validate,
  async (req, res) => {
    const data = { ...req.body };
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    try {
      const result = await pool.query(
        `UPDATE users
         SET name = COALESCE($1, name),
             email = COALESCE($2, email),
             password = COALESCE($3, password),
             role = COALESCE($4, role)
         WHERE id = $5
         RETURNING id, name, email, role`,
        [data.name || null, data.email || null, data.password || null, data.role || null, req.params.id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
      res.json(result.rows[0]);
    } catch (err) {
      if (err.code === '23505') return res.status(409).json({ error: 'Email already used' });
      throw err;
    }
  }
);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user (ADMIN)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Deleted }
 */
router.delete('/:id', async (req, res) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

module.exports = router;
