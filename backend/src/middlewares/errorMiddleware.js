const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route ${req.originalUrl} introuvable`));
}

function errorHandler(err, req, res, next) {
  let error = err;

  // Sequelize : unicité
  if (err.name === 'SequelizeUniqueConstraintError') {
    error = ApiError.conflict(
      'Conflit d\'unicité',
      err.errors.map((e) => ({ field: e.path, message: e.message }))
    );
  }
  // Sequelize : validation
  else if (err.name === 'SequelizeValidationError') {
    error = ApiError.badRequest(
      'Erreur de validation',
      err.errors.map((e) => ({ field: e.path, message: e.message }))
    );
  }
  // Sequelize : FK
  else if (err.name === 'SequelizeForeignKeyConstraintError') {
    error = ApiError.conflict('Contrainte de clé étrangère violée');
  }

  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    logger.error(`${error.message}\n${error.stack}`);
  } else {
    logger.warn(`${statusCode} - ${error.message}`);
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Erreur interne du serveur',
    ...(error.details && { details: error.details }),
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}

module.exports = { notFoundHandler, errorHandler };