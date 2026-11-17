const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const { Product, StockMovement, Alert, sequelize } = require('../models');
const { getPaginationParams, buildPaginationResponse } = require('../utils/pagination');

/**
 * Enregistre un mouvement de stock et met à jour le produit
 */
async function createMovement({ productId, type, quantity, reason, userId }, transaction = null) {
  const t = transaction || (await sequelize.transaction());
  const ownTx = !transaction;

  try {
    const product = await Product.findByPk(productId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!product) throw ApiError.notFound('Produit introuvable');

    const previousStock = product.stockQuantity;
    let newStock = previousStock;

    if (type === 'IN') newStock = previousStock + quantity;
    else if (type === 'OUT') {
      if (previousStock < quantity) throw ApiError.conflict(`Stock insuffisant : ${previousStock} disponible(s)`);
      newStock = previousStock - quantity;
    } else if (type === 'ADJUSTMENT') newStock = quantity;

    product.stockQuantity = newStock;
    await product.save({ transaction: t });

    const movement = await StockMovement.create({
      productId, type, quantity, previousStock, newStock, reason, userId,
    }, { transaction: t });

    await Alert.destroy({ where: { productId, isRead: false }, transaction: t });

    if (newStock === 0) {
      await Alert.create({
        productId,
        type: 'OUT_OF_STOCK',
        message: `Rupture de stock : ${product.name}`,
      }, { transaction: t });
    } else if (newStock <= product.alertThreshold) {
      await Alert.create({
        productId,
        type: 'LOW_STOCK',
        message: `Stock bas : ${product.name} (${newStock} restants, seuil ${product.alertThreshold})`,
      }, { transaction: t });
    }

    if (ownTx) await t.commit();
    return movement;
  } catch (e) {
    if (ownTx) await t.rollback();
    throw e;
  }
}

async function listMovements(query) {
  const { page, limit, offset } = getPaginationParams(query);
  const where = {};
  if (query.productId) where.productId = query.productId;
  if (query.type) where.type = query.type;

  const { count, rows } = await StockMovement.findAndCountAll({
    where,
    include: [
      { model: Product, as: 'product', attributes: ['id', 'name', 'sku'] },
      { model: require('../models').User, as: 'user', attributes: ['id', 'firstName', 'lastName'] },
    ],
    limit, offset,
    order: [['id', 'DESC']],
  });
  return buildPaginationResponse(rows, count, page, limit);
}

async function listAlerts(query) {
  const { page, limit, offset } = getPaginationParams(query);
  const where = {};
  if (query.isRead !== undefined) where.isRead = query.isRead === 'true';

  const { count, rows } = await Alert.findAndCountAll({
    where,
    include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'sku', 'stockQuantity'] }],
    limit, offset,
    order: [['id', 'DESC']],
  });
  return buildPaginationResponse(rows, count, page, limit);
}

async function markAlertRead(id) {
  const alert = await Alert.findByPk(id);
  if (!alert) throw ApiError.notFound('Alerte introuvable');
  alert.isRead = true;
  await alert.save();
  return alert;
}

module.exports = { createMovement, listMovements, listAlerts, markAlertRead };