const app = require('./app');
const env = require('./config/env');
const { testConnection } = require('./config/database');
const logger = require('./utils/logger');
const { sequelize } = require('./models');

async function start() {
  try {
    await testConnection();

    //  alter: false = ne touche pas aux tables existantes
    // On utilise les tables déjà créées en SQL
    await sequelize.authenticate();
    logger.info(' Modèles Sequelize prêts');

    app.listen(env.PORT, () => {
      logger.info(` Serveur démarré sur http://localhost:${env.PORT}`);
      logger.info(` Swagger : http://localhost:${env.PORT}${env.SWAGGER_URL}`);
      logger.info(` Environnement : ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error(` Échec du démarrage : ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => {
  logger.error(`UnhandledRejection : ${err.message}`);
});

start();