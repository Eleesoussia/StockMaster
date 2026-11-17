const stockService = require('../services/stockService');

async function createMovement(req, res, next) {
  try {
    const movement = await stockService.createMovement({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json({ success: true, data: movement });
  } catch (e) { next(e); }
}

async function listMovements(req, res, next) {
  try {
    const result = await stockService.listMovements(req.query);
    res.json({ success: true, ...result });
  } catch (e) { next(e); }
}

async function listAlerts(req, res, next) {
  try {
    const result = await stockService.listAlerts(req.query);
    res.json({ success: true, ...result });
  } catch (e) { next(e); }
}

async function markRead(req, res, next) {
  try {
    const alert = await stockService.markAlertRead(req.params.id);
    res.json({ success: true, data: alert });
  } catch (e) { next(e); }
}

module.exports = { createMovement, listMovements, listAlerts, markRead };