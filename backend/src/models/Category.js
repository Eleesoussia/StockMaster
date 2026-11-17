const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  parentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, field: 'parent_id' },
  imageUrl: { type: DataTypes.STRING(500), allowNull: true, field: 'image_url' },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
  createdAt: { type: DataTypes.DATE, field: 'created_at' },
  updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
}, {
  tableName: 'categories',
  timestamps: true,
});

module.exports = Category;