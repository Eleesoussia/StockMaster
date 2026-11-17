/**
 * Classe d'erreur personnalisée pour l'API
 * Permet de retourner un code HTTP et un message structuré
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  // ─── Méthodes raccourcies ───
  static badRequest(message, details) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'Non authentifié') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Accès refusé') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Ressource introuvable') {
    return new ApiError(404, message);
  }

  static conflict(message, details) {
    return new ApiError(409, message, details);
  }

  static internal(message = 'Erreur interne du serveur') {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;