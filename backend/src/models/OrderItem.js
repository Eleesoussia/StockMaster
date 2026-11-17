const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  orderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'order_id' },
  productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'product_id' },
  quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false, field: 'unit_price', validate: { min: 0 } },
  subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
  createdAt: { type: DataTypes.DATE, field: 'created_at' },
}, {
  tableName: 'order_items',
  timestamps: true,
  updatedAt: false,
});

module.exports = OrderItem;