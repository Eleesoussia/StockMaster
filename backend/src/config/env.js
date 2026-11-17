const dotenv = require('dotenv');

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,

  // Base de données
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 3306,
  DB_NAME: process.env.DB_NAME || 'stockmaster',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

  // Upload
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Swagger
  SWAGGER_URL: process.env.SWAGGER_URL || '/api-docs',
};

module.exports = env;