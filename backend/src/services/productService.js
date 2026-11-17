const { Op, where } = require('sequelize');
const ApiError = require('../utils/ApiError');
const { Product, Category, StockMovement, Alert, sequelize } = require('../models');
const { getPaginationParams, buildPaginationResponse } = require('../utils/pagination');

async function create(data, userId) {
  if (data.categoryId) {
    const cat = await Category.findByPk(data.categoryId);
    if (!cat) throw ApiError.notFound('Catégorie introuvable');
  }

  const t = await sequelize.transaction();
  try {
    const product = await Product.create(data, { transaction: t });

    // Si un stock initial est fourni, on crée un mouvement d'entrée
    if (product.stockQuantity > 0) {
      await StockMovement.create({
        productId: product.id,
        type: 'IN',
        quantity: product.stockQuantity,
        previousStock: 0,
        newStock: product.stockQuantity,
        reason: 'Stock initial (création produit)',
        userId,
      }, { transaction: t });
    }
    await t.commit();
    return product;
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

async function list(query) {
  const { page, limit, offset } = getPaginationParams(query);

  const where = { isActive: true };
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${query.search}%` } },
      { sku: { [Op.like]: `%${query.search}%` } },
    ];
  }
  if (query.minPrice) where.price = { ...(where.price || {}), [Op.gte]: query.minPrice };
  if (query.maxPrice) where.price = { ...(where.price || {}), [Op.lte]: query.maxPrice };

  const { count, rows } = await Product.findAndCountAll({
    where,
    include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    limit,
    offset,
    order: [['id', 'DESC']],
  });

  return buildPaginationResponse(rows, count, page, limit);
}

async function getById(id) {
  const product = await Product.findByPk(id, {
    include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
  });
  if (!product) throw ApiError.notFound('Produit introuvable');
  return product;
}

async function update(id, data, userId) {
  const product = await Product.findByPk(id);
  if (!product) throw ApiError.notFound('Produit introuvable');
  if (data.categoryId) {
    const cat = await Category.findByPk(data.categoryId);
    if (!cat) throw ApiError.notFound('Catégorie introuvable');
  }

  const t = await sequelize.transaction();
  try {
    const previousStock = product.stockQuantity;
    
    await product.update(data, { transaction: t });

    // Si le stock a été modifié manuellement via le formulaire
    if (data.stockQuantity !== undefined && data.stockQuantity !== previousStock) {
      await StockMovement.create({
        productId: product.id,
        type: 'ADJUSTMENT',
        quantity: Math.abs(data.stockQuantity - previousStock),
        previousStock: previousStock,
        newStock: data.stockQuantity,
        reason: 'Ajustement manuel (modification produit)',
        userId,
      }, { transaction: t });
    }

    // Vérifier si on doit supprimer les alertes
    if (product.stockQuantity > product.alertThreshold) {
      await Alert.destroy({ where: { productId: product.id, isRead: false }, transaction: t });
    } else if (product.stockQuantity > 0 && product.stockQuantity <= product.alertThreshold) {
      await Alert.destroy({ where: { productId: product.id, type: 'OUT_OF_STOCK', isRead: false }, transaction: t });
    }

    await t.commit();
    return product;
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

async function remove(id) {
  const product = await Product.findByPk(id);
  if (!product) throw ApiError.notFound('Produit introuvable');
  await product.update({ isActive: false });
}

async function listLowStock() {
  return Product.findAll({
    where: {
      isActive: true,
      [Op.and]: sequelize.where(
        sequelize.col('stock_quantity'),
        Op.lte,
        sequelize.col('alert_threshold')
      )
    },
  });
}

module.exports = { create, list, getById, update, remove, listLowStock };