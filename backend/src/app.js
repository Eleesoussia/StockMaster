const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const routes = require('./routes');
const swaggerSpec = require('./docs/swagger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// Sécurité & parsing
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Fichiers statiques (uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', env.UPLOAD_DIR)));

// Swagger
app.use(env.SWAGGER_URL, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api', routes);

// 404 + erreurs
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;