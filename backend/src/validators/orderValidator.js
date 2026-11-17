const { body } = require('express-validator');

const createOrderValidator = [
  body('items').isArray({ min: 1 }).withMessage('Au moins un produit requis'),
  body('items.*.productId').isInt({ min: 1 }).withMessage('productId invalide'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantité invalide'),
  body('shippingAddress').trim().notEmpty().withMessage('Adresse requise'),
  body('notes').optional({ nullable: true }).isString(),
];

const updateOrderStatusValidator = [
  body('status')
    .isIn(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    .withMessage('Statut invalide'),
];

const stockMovementValidator = [
  body('productId').isInt({ min: 1 }).withMessage('productId invalide'),
  body('type').isIn(['IN', 'OUT', 'ADJUSTMENT']).withMessage('Type invalide'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantité invalide'),
  body('reason').optional({ nullable: true }).isString(),
];

module.exports = { createOrderValidator, updateOrderStatusValidator, stockMovementValidator };