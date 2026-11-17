const productService = require('../services/productService');

async function create(req, res, next) {
  try {
    const product = await productService.create(req.body, req.user.id);
    res.status(201).json({ success: true, data: product });
  } catch (e) { next(e); }
}

async function list(req, res, next) {
  try {
    const result = await productService.list(req.query);
    res.json({ success: true, ...result });
  } catch (e) { next(e); }
}

async function getById(req, res, next) {
  try {
    const product = await productService.getById(req.params.id);
    res.json({ success: true, data: product });
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    const product = await productService.update(req.params.id, req.body, req.user.id);
    res.json({ success: true, data: product });
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    await productService.remove(req.params.id);
    res.json({ success: true, message: 'Produit supprimé' });
  } catch (e) { next(e); }
}

async function lowStock(req, res, next) {
  try {
    const products = await productService.listLowStock();
    res.json({ success: true, data: products });
  } catch (e) { next(e); }
}

module.exports = { create, list, getById, update, remove, lowStock };