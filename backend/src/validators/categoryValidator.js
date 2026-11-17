const { body } = require('express-validator');

const createCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Nom requis').isLength({ max: 150 }),
  body('description').optional({ nullable: true }).isString(),
  body('parentId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('parentId invalide'),
];

const updateCategoryValidator = [
  body('name').optional().trim().isLength({ min: 1, max: 150 }),
  body('description').optional({ nullable: true }).isString(),
  body('parentId').optional({ nullable: true }).isInt({ min: 1 }),
];

module.exports = { createCategoryValidator, updateCategoryValidator };