const express = require('express');
const { body } = require('express-validator');
const Moto = require('../models/Moto');
const { authRequired, validate } = require('../middlewares');

const router = express.Router();
router.use(authRequired);

/**
 * @openapi
 * /motos:
 *   get:
 *     tags: [Motos]
 *     summary: List motos
 *     responses: { 200: { description: OK } }
 *   post:
 *     tags: [Motos]
 *     summary: Create moto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand: { type: string }
 *               model: { type: string }
 *               year: { type: integer }
 *               cc: { type: integer }
 *     responses: { 201: { description: Created } }
 */
router.get('/', async (_req, res) => {
  const list = await Moto.find();
  res.json(list);
});

router.post(
  '/',
  body('brand').isString().notEmpty(),
  body('model').isString().notEmpty(),
  body('year').isInt(),
  validate,
  async (req, res) => {
    const moto = await Moto.create(req.body);
    res.status(201).json(moto);
  }
);

/**
 * @openapi
 * /motos/{id}:
 *   get:
 *     tags: [Motos]
 *     summary: Get moto by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses: { 200: { description: OK } }
 *   put:
 *     tags: [Motos]
 *     summary: Update moto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses: { 200: { description: OK } }
 *   delete:
 *     tags: [Motos]
 *     summary: Delete moto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses: { 204: { description: Deleted } }
 */
router.get('/:id', async (req, res) => {
  const moto = await Moto.findById(req.params.id).catch(() => null);
  if (!moto) return res.status(404).json({ error: 'Not found' });
  res.json(moto);
});

router.put('/:id', async (req, res) => {
  const moto = await Moto.findByIdAndUpdate(req.params.id, req.body, { new: true }).catch(() => null);
  if (!moto) return res.status(404).json({ error: 'Not found' });
  res.json(moto);
});

router.delete('/:id', async (req, res) => {
  const moto = await Moto.findByIdAndDelete(req.params.id).catch(() => null);
  if (!moto) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

module.exports = router;
