const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StockMovement = sequelize.define('StockMovement', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'product_id' },
  type: { type: DataTypes.ENUM('IN', 'OUT', 'ADJUSTMENT'), allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  previousStock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'previous_stock' },
  newStock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'new_stock' },
  reason: { type: DataTypes.STRING(255), allowNull: true },
  userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, field: 'user_id' },
  createdAt: { type: DataTypes.DATE, field: 'created_at' },
}, {
  tableName: 'stock_movements',
  timestamps: true,
  updatedAt: false,
});

module.exports = StockMovement;