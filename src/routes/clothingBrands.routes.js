const express = require('express');
const { body } = require('express-validator');
const ClothingBrand = require('../models/ClothingBrand');
const { authRequired, validate } = require('../middlewares');

const router = express.Router();
router.use(authRequired);

/**
 * @openapi
 * /clothing-brands:
 *   get:
 *     tags: [ClothingBrands]
 *     summary: List brands
 *     responses: { 200: { description: OK } }
 *   post:
 *     tags: [ClothingBrands]
 *     summary: Create brand
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               country: { type: string }
 *               foundedYear: { type: integer }
 *     responses: { 201: { description: Created } }
 */
router.get('/', async (_req, res) => {
  const list = await ClothingBrand.find();
  res.json(list);
});

router.post(
  '/',
  body('name').isString().trim().notEmpty().withMessage('name obrigatorio'),
  body('country').isString().trim().notEmpty().withMessage('country obrigatorio'),
  body('foundedYear').optional().isInt({ min: 1800, max: 2026 }).withMessage('foundedYear deve ser inteiro entre 1800 e 2026'),
  validate,
  async (req, res) => {
    const brand = await ClothingBrand.create(req.body);
    res.status(201).json(brand);
  }
);

/**
 * @openapi
 * /clothing-brands/{id}:
 *   get:
 *     tags: [ClothingBrands]
 *     summary: Get brand by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses: { 200: { description: OK } }
 *   put:
 *     tags: [ClothingBrands]
 *     summary: Update brand
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses: { 200: { description: OK } }
 *   delete:
 *     tags: [ClothingBrands]
 *     summary: Delete brand
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses: { 204: { description: Deleted } }
 */
router.get('/:id', async (req, res) => {
  const brand = await ClothingBrand.findById(req.params.id).catch(() => null);
  if (!brand) return res.status(404).json({ error: 'Not found' });
  res.json(brand);
});

router.put(
  '/:id',
  body('name').optional().isString().trim().notEmpty(),
  body('country').optional().isString().trim().notEmpty(),
  body('foundedYear').optional().isInt({ min: 1800, max: 2026 }),
  validate,
  async (req, res) => {
    const brand = await ClothingBrand.findByIdAndUpdate(req.params.id, req.body, { new: true }).catch(() => null);
    if (!brand) return res.status(404).json({ error: 'Not found' });
    res.json(brand);
  }
);

router.delete('/:id', async (req, res) => {
  const brand = await ClothingBrand.findByIdAndDelete(req.params.id).catch(() => null);
  if (!brand) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

module.exports = router;
