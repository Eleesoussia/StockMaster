const { Op, fn, col, literal } = require('sequelize');
const { Product, Order, User, Category, Alert, sequelize } = require('../models');

async function getStats() {
  // ✅ 100% SQL BRUT POUR ÉVITER TOUS LES BUGS SEQUELIZE
  const [counts] = await sequelize.query(`
    SELECT 
      (SELECT COUNT(*) FROM products WHERE is_active = 1) AS totalProducts,
      (SELECT COUNT(*) FROM categories) AS totalCategories,
      (SELECT COUNT(*) FROM orders) AS totalOrders,
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM alerts WHERE is_read = 0) AS activeAlerts,
      (SELECT COUNT(*) FROM products WHERE stock_quantity = 0 AND is_active = 1) AS outOfStockCount,
      (SELECT COUNT(*) FROM products WHERE stock_quantity > 0 AND stock_quantity <= alert_threshold AND is_active = 1) AS lowStockCount,
      (SELECT COALESCE(SUM(price * stock_quantity), 0) FROM products WHERE is_active = 1) AS totalStockValue,
      (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status IN ('CONFIRMED', 'SHIPPED', 'DELIVERED')) AS totalRevenue
  `, { type: sequelize.QueryTypes.SELECT });

  return {
    totalProducts: counts.totalProducts,
    totalCategories: counts.totalCategories,
    totalOrders: counts.totalOrders,
    totalUsers: counts.totalUsers,
    activeAlerts: counts.activeAlerts,
    outOfStockCount: counts.outOfStockCount,
    lowStockCount: counts.lowStockCount,
    totalStockValue: parseFloat(counts.totalStockValue).toFixed(2),
    totalRevenue: parseFloat(counts.totalRevenue).toFixed(2),
  };
}

async function getSalesByDay(period = '7days') {
  let days = 7;
  if (period === 'today') days = 1;
  if (period === '30days') days = 30;
  if (period === 'year') days = 365;

  const since = new Date();
  since.setDate(since.getDate() - days);

  const rows = await Order.findAll({
    attributes: [
      [fn('DATE', col('created_at')), 'date'],
      [fn('COUNT', col('id')), 'count'],
      [fn('SUM', col('total_amount')), 'total'],
    ],
    where: { createdAt: { [Op.gte]: since }, status: { [Op.ne]: 'CANCELLED' } },
    group: [fn('DATE', col('created_at'))],
    order: [[fn('DATE', col('created_at')), 'ASC']],
    raw: true,
  });

  return rows;
}

async function getTopProducts(limit = 5) {
  const rows = await sequelize.query(`
    SELECT p.id, p.name, p.sku, SUM(oi.quantity) AS total_sold
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    JOIN orders o ON o.id = oi.order_id
    WHERE o.status != 'CANCELLED'
    GROUP BY p.id, p.name, p.sku
    ORDER BY total_sold DESC
    LIMIT :limit
  `, { replacements: { limit }, type: sequelize.QueryTypes.SELECT });
  return rows;
}

async function getProductsByCategory() {
  return Category.findAll({
    attributes: [
      'id', 'name',
      [fn('COUNT', col('products.id')), 'productCount'],
    ],
    include: [{ model: Product, as: 'products', attributes: [] }],
    group: ['Category.id'],
    raw: true,
  });
}

module.exports = { getStats, getSalesByDay, getTopProducts, getProductsByCategory };