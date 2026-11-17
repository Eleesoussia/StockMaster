const { Sequelize } = require('sequelize');
const env = require('./env');
const logger = require('../utils/logger');

const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'mysql',
    logging: env.NODE_ENV === 'development'
      ? (msg) => logger.debug(msg)
      : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,
      timestamps: true,
    },
  }
);

/**
 * Teste la connexion à la base de données
 */
async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info(`Connecté à MySQL : ${env.DB_NAME}`);
  } catch (error) {
    logger.error(`Impossible de se connecter à MySQL : ${error.message}`);
    throw error;
  }
}

module.exports = { sequelize, testConnection };