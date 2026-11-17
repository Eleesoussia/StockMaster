const dashboardService = require('../services/dashboardService');

async function stats(req, res, next) {
  try {
    const data = await dashboardService.getStats();
    res.json({ success: true, data });
  } catch (e) { next(e); }
}

async function salesByDay(req, res, next) {
  try {
    const period = req.query.period || '7days';
    const data = await dashboardService.getSalesByDay(period);
    res.json({ success: true, data });
  } catch (e) { next(e); }
}

async function topProducts(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const data = await dashboardService.getTopProducts(limit);
    res.json({ success: true, data });
  } catch (e) { next(e); }
}

async function productsByCategory(req, res, next) {
  try {
    const data = await dashboardService.getProductsByCategory();
    res.json({ success: true, data });
  } catch (e) { next(e); }
}

module.exports = { stats, salesByDay, topProducts, productsByCategory };