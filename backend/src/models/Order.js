const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  orderNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true, field: 'order_number' },
  userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' },
  status: { type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'), allowNull: false, defaultValue: 'PENDING' },
  totalAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0, field: 'total_amount' },
  shippingAddress: { type: DataTypes.TEXT, allowNull: false, field: 'shipping_address' },
  notes: { type: DataTypes.TEXT, allowNull: true },
  createdAt: { type: DataTypes.DATE, field: 'created_at' },
  updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
}, {
  tableName: 'orders',
  timestamps: true,
});

module.exports = Order;