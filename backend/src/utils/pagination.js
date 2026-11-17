/**
 * Helpers de pagination
 */

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

/**
 * Extrait et valide les paramètres de pagination depuis req.query
 * @param {object} query - req.query
 * @returns {{page: number, limit: number, offset: number}}
 */
function getPaginationParams(query) {
  let page = parseInt(query.page, 10) || DEFAULT_PAGE;
  let limit = parseInt(query.limit, 10) || DEFAULT_LIMIT;

  if (page < 1) page = DEFAULT_PAGE;
  if (limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Construit l'objet de réponse paginée
 * @param {Array} data - Les données
 * @param {number} total - Total d'éléments
 * @param {number} page - Page courante
 * @param {number} limit - Limite par page
 */
function buildPaginationResponse(data, total, page, limit) {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}

module.exports = {
  getPaginationParams,
  buildPaginationResponse,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};