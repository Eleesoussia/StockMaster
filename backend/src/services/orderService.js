const { sequelize, Order, OrderItem, Product, User, Alert } = require('../models');
const ApiError = require('../utils/ApiError');
const { getPaginationParams, buildPaginationResponse } = require('../utils/pagination');

/**
 * Génère un numéro de commande unique : ORD-2025-000X
 */
async function generateOrderNumber() {
  const year = new Date().getFullYear();
  const count = await Order.count();
  return `ORD-${year}-${String(count + 1).padStart(4, '0')}`;
}

async function create(userId, { items, shippingAddress, notes }) {
  const t = await sequelize.transaction();
  try {
    // Vérifier les produits
    const productIds = items.map((i) => i.productId);
    const products = await Product.findAll({ where: { id: productIds }, transaction: t });

    if (products.length !== productIds.length) {
      throw ApiError.badRequest('Un ou plusieurs produits sont introuvables');
    }

    // Vérifier stocks
    const productMap = new Map(products.map((p) => [p.id, p]));
    for (const item of items) {
      const p = productMap.get(item.productId);
      if (!p.isActive) throw ApiError.badRequest(`Produit "${p.name}" inactif`);
      if (p.stockQuantity < item.quantity) {
        throw ApiError.conflict(`Stock insuffisant pour "${p.name}" : ${p.stockQuantity} disponible(s)`);
      }
    }

    // Créer la commande
    const orderNumber = await generateOrderNumber();
    const order = await Order.create({
      orderNumber, userId, shippingAddress, notes, status: 'PENDING', totalAmount: 0,
    }, { transaction: t });

    // Créer les lignes + décrémenter le stock
    let total = 0;
    for (const item of items) {
      const p = productMap.get(item.productId);
      const unitPrice = parseFloat(p.price);
      const subtotal = unitPrice * item.quantity;
      total += subtotal;

      await OrderItem.create({
        orderId: order.id,
        productId: p.id,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      }, { transaction: t });

      const previousStock = p.stockQuantity;
      const newStock = previousStock - item.quantity;
      p.stockQuantity = newStock;
      await p.save({ transaction: t });

      // Historique mouvement
      await require('../models').StockMovement.create({
        productId: p.id,
        type: 'OUT',
        quantity: item.quantity,
        previousStock,
        newStock,
        reason: `Commande ${orderNumber}`,
        userId,
      }, { transaction: t });

      // Alerte si nécessaire
      if (newStock === 0) {
        await Alert.create({
          productId: p.id, type: 'OUT_OF_STOCK',
          message: `Rupture de stock : ${p.name} (commande ${orderNumber})`,
        }, { transaction: t });
      } else if (newStock <= p.alertThreshold) {
        await Alert.create({
          productId: p.id, type: 'LOW_STOCK',
          message: `Stock bas : ${p.name} (${newStock} restants, commande ${orderNumber})`,
        }, { transaction: t });
      }
    }

    order.totalAmount = total;
    await order.save({ transaction: t });

    await t.commit();

    return Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'sku'] }] },
        { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] },
      ],
    });
  } catch (e) {
    await t.rollback();
    throw e;
  }
}

async function list(query, currentUser) {
  const { page, limit, offset } = getPaginationParams(query);
  const where = {};

  // Un client ne voit que ses propres commandes
  if (currentUser.role === 'CLIENT') where.userId = currentUser.id;
  if (query.status) where.status = query.status;
  if (query.userId && currentUser.role !== 'CLIENT') where.userId = query.userId;

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [
      { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] },
      { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'name'] }] },
    ],
    limit, offset,
    order: [['id', 'DESC']],
    distinct: true,
  });

  return buildPaginationResponse(rows, count, page, limit);
}

async function getById(id, currentUser) {
  const order = await Order.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] },
      { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'sku', 'price'] }] },
    ],
  });
  if (!order) throw ApiError.notFound('Commande introuvable');
  if (currentUser.role === 'CLIENT' && order.userId !== currentUser.id) {
    throw ApiError.forbidden('Accès refusé à cette commande');
  }
  return order;
}

async function updateStatus(id, status) {
  const order = await Order.findByPk(id);
  if (!order) throw ApiError.notFound('Commande introuvable');

  const allowed = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (!allowed[order.status].includes(status)) {
    throw ApiError.badRequest(`Transition ${order.status} → ${status} non autorisée`);
  }

  order.status = status;
  await order.save();
  return order;
}

async function cancel(id, currentUser) {
  const order = await Order.findByPk(id);
  if (!order) throw ApiError.notFound('Commande introuvable');

  if (currentUser.role === 'CLIENT' && order.userId !== currentUser.id) {
    throw ApiError.forbidden();
  }
  if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
    throw ApiError.badRequest('Cette commande ne peut plus être annulée');
  }

  order.status = 'CANCELLED';
  await order.save();
  return order;
}

module.exports = { create, list, getById, updateStatus, cancel };