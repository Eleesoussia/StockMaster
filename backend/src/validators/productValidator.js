const { body } = require('express-validator');

const createProductValidator = [
  body('name').trim().notEmpty().withMessage('Nom requis').isLength({ max: 255 }),
  body('sku').trim().notEmpty().withMessage('SKU requis').isLength({ max: 100 }),
  body('price').isFloat({ min: 0 }).withMessage('Prix invalide'),
  body('costPrice').optional({ nullable: true }).isFloat({ min: 0 }),
  body('stockQuantity').optional().isInt({ min: 0 }),
  body('alertThreshold').optional().isInt({ min: 0 }),
  body('categoryId').optional({ nullable: true }).isInt({ min: 1 }),
  body('description').optional({ nullable: true }).isString(),
];

const updateProductValidator = [
  body('name').optional().trim().isLength({ min: 1, max: 255 }),
  body('sku').optional().trim().isLength({ min: 1, max: 100 }),
  body('price').optional().isFloat({ min: 0 }),
  body('costPrice').optional({ nullable: true }).isFloat({ min: 0 }),
  body('stockQuantity').optional().isInt({ min: 0 }),
  body('alertThreshold').optional().isInt({ min: 0 }),
  body('categoryId').optional({ nullable: true }).isInt({ min: 1 }),
  body('description').optional({ nullable: true }).isString(),
  body('isActive').optional().isBoolean(),
];

module.exports = { createProductValidator, updateProductValidator };