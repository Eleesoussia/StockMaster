const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  sku: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
  costPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: 'cost_price', validate: { min: 0 } },
  stockQuantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'stock_quantity', validate: { min: 0 } },
  alertThreshold: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10, field: 'alert_threshold', validate: { min: 0 } },
  categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, field: 'category_id' },
  imageUrl: { type: DataTypes.STRING(500), allowNull: true, field: 'image_url' },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
  createdAt: { type: DataTypes.DATE, field: 'created_at' },
  updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
}, {
  tableName: 'products',
  timestamps: true,
});

Product.prototype.isLowStock = function () {
  return this.stockQuantity > 0 && this.stockQuantity <= this.alertThreshold;
};

Product.prototype.isOutOfStock = function () {
  return this.stockQuantity === 0;
};

module.exports = Product;