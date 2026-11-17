const swaggerJsdoc = require('swagger-jsdoc');
const env = require('../config/env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StockMaster API',
      version: '1.0.0',
      description: 'API RESTful de gestion d\'inventaire de produits',
    },
    servers: [{ url: `http://localhost:${env.PORT}/api` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentification' },
      { name: 'Categories', description: 'Gestion des catégories' },
      { name: 'Products', description: 'Gestion des produits' },
      { name: 'Orders', description: 'Gestion des commandes' },
      { name: 'Stock', description: 'Gestion des stocks et alertes' },
      { name: 'Dashboard', description: 'Statistiques' },
    ],
  },
  apis: ['./src/routes/*.js', './src/docs/*.yaml'],
};

module.exports = swaggerJsdoc(options);