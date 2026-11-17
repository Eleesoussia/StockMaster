const categoryService = require('../services/categoryService');

async function create(req, res, next) {
  try {
    const cat = await categoryService.create(req.body);
    res.status(201).json({ success: true, data: cat });
  } catch (e) { next(e); }
}

async function list(req, res, next) {
  try {
    const cats = await categoryService.list();
    res.json({ success: true, data: cats });
  } catch (e) { next(e); }
}

async function getById(req, res, next) {
  try {
    const cat = await categoryService.getById(req.params.id);
    res.json({ success: true, data: cat });
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    const cat = await categoryService.update(req.params.id, req.body);
    res.json({ success: true, data: cat });
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    await categoryService.remove(req.params.id);
    res.json({ success: true, message: 'Catégorie supprimée' });
  } catch (e) { next(e); }
}

module.exports = { create, list, getById, update, remove };