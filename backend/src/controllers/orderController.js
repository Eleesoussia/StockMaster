const orderService = require('../services/orderService');

async function create(req, res, next) {
  try {
    const order = await orderService.create(req.user.id, req.body);
    res.status(201).json({ success: true, data: order });
  } catch (e) { next(e); }
}

async function list(req, res, next) {
  try {
    const result = await orderService.list(req.query, req.user);
    res.json({ success: true, ...result });
  } catch (e) { next(e); }
}

async function getById(req, res, next) {
  try {
    const order = await orderService.getById(req.params.id, req.user);
    res.json({ success: true, data: order });
  } catch (e) { next(e); }
}

async function updateStatus(req, res, next) {
  try {
    const order = await orderService.updateStatus(req.params.id, req.body.status);
    res.json({ success: true, data: order });
  } catch (e) { next(e); }
}

async function cancel(req, res, next) {
  try {
    const order = await orderService.cancel(req.params.id, req.user);
    res.json({ success: true, data: order });
  } catch (e) { next(e); }
}

module.exports = { create, list, getById, updateStatus, cancel };