const ApiError = require('../utils/ApiError');

/**
 * Middleware pour restreindre l'accès à certains rôles
 * @param  {...string} roles - Les rôles autorisés
 */
function roleMiddleware(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Rôle "${req.user.role}" non autorisé`));
    }
    next();
  };
}

module.exports = roleMiddleware;