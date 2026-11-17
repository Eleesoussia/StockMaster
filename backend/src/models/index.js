const { sequelize } = require('../config/database');

const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const StockMovement = require('./StockMovement');
const Alert = require('./Alert');

// ─── User ↔ Order ───
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ─── Order ↔ OrderItem ───
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// ─── Product ↔ OrderItem ───
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// ─── Category ↔ Product ───
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// ─── Category auto-référence ───
Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

// ─── Product ↔ StockMovement ───
Product.hasMany(StockMovement, { foreignKey: 'productId', as: 'movements' });
StockMovement.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// ─── User ↔ StockMovement ───
User.hasMany(StockMovement, { foreignKey: 'userId', as: 'stockMovements' });
StockMovement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ─── Product ↔ Alert ───
Product.hasMany(Alert, { foreignKey: 'productId', as: 'alerts' });
Alert.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// exporter sequelize pour server.js et les transactions
module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem,
  StockMovement,
  Alert,
};