const express = require('express');
const { body } = require('express-validator');
const Car = require('../models/Car');
const { authRequired, validate } = require('../middlewares');

const router = express.Router();
router.use(authRequired);

/**
 * @openapi
 * /cars:
 *   get:
 *     tags: [Cars]
 *     summary: List cars
 *     responses: { 200: { description: OK } }
 *   post:
 *     tags: [Cars]
 *     summary: Create car
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
 *               color: { type: string }
 *     responses: { 201: { description: Created } }
 */
router.get('/', async (_req, res) => {
  const cars = await Car.find();
  res.json(cars);
});

router.post(
  '/',
  body('brand').isString().trim().notEmpty().withMessage('brand obrigatorio'),
  body('model').isString().trim().notEmpty().withMessage('model obrigatorio'),
  body('year').isInt({ min: 2015, max: 2026 }).withMessage('year deve ser inteiro entre 2015 e 2026'),
  body('color').isString().trim().notEmpty().withMessage('color obrigatorio'),
  validate,
  async (req, res) => {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  }
);

/**
 * @openapi
 * /cars/{id}:
 *   get:
 *     tags: [Cars]
 *     summary: Get car by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses: { 200: { description: OK } }
 *   put:
 *     tags: [Cars]
 *     summary: Update car
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses: { 200: { description: OK } }
 *   delete:
 *     tags: [Cars]
 *     summary: Delete car
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses: { 204: { description: Deleted } }
 */
router.get('/:id', async (req, res) => {
  const car = await Car.findById(req.params.id).catch(() => null);
  if (!car) return res.status(404).json({ error: 'Not found' });
  res.json(car);
});

router.put(
  '/:id',
  body('brand').optional().isString().trim().notEmpty(),
  body('model').optional().isString().trim().notEmpty(),
  body('year').optional().isInt({ min: 2015, max: 2026 }),
  body('color').optional().isString().trim().notEmpty(),
  validate,
  async (req, res) => {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true }).catch(() => null);
    if (!car) return res.status(404).json({ error: 'Not found' });
    res.json(car);
  }
);

router.delete('/:id', async (req, res) => {
  const car = await Car.findByIdAndDelete(req.params.id).catch(() => null);
  if (!car) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

module.exports = router;
