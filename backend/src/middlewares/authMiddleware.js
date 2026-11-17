const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Token manquant ou invalide');
    }

    const token = header.split(' ')[1];
    const payload = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findByPk(payload.id);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Utilisateur introuvable ou désactivé');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token invalide ou expiré'));
    }
    next(error);
  }
}

module.exports = authMiddleware;