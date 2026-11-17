const ApiError = require('../utils/ApiError');
const { Category, Product } = require('../models');

async function create(data) {
  if (data.parentId) {
    const parent = await Category.findByPk(data.parentId);
    if (!parent) throw ApiError.notFound('Catégorie parente introuvable');
  }
  return Category.create(data);
}

async function list() {
  return Category.findAll({
    include: [{ model: Category, as: 'parent', attributes: ['id', 'name'] }],
    order: [['id', 'DESC']],
  });
}

async function getById(id) {
  const category = await Category.findByPk(id, {
    include: [
      { model: Category, as: 'parent', attributes: ['id', 'name'] },
      { model: Category, as: 'children', attributes: ['id', 'name'] },
    ],
  });
  if (!category) throw ApiError.notFound('Catégorie introuvable');
  return category;
}

async function update(id, data) {
  const category = await Category.findByPk(id);
  if (!category) throw ApiError.notFound('Catégorie introuvable');
  if (data.parentId === id) throw ApiError.badRequest('Une catégorie ne peut pas être son propre parent');
  await category.update(data);
  return category;
}

async function remove(id) {
  const category = await Category.findByPk(id);
  if (!category) throw ApiError.notFound('Catégorie introuvable');

  const productCount = await Product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    throw ApiError.conflict(`${productCount} produit(s) sont associés à cette catégorie`);
  }
  await category.destroy();
}

module.exports = { create, list, getById, update, remove };