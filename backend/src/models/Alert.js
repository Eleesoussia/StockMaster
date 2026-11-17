const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Alert = sequelize.define('Alert', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'product_id' },
  type: { type: DataTypes.ENUM('LOW_STOCK', 'OUT_OF_STOCK'), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_read' },
  createdAt: { type: DataTypes.DATE, field: 'created_at' },
}, {
  tableName: 'alerts',
  timestamps: true,
  updatedAt: false,
});

module.exports = Alert;