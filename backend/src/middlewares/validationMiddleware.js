const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

function validationMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return next(ApiError.badRequest('Données invalides', details));
  }
  next();
}

module.exports = validationMiddleware;