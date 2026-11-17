const { body } = require('express-validator');

const registerValidator = [
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe : 6 caractères minimum'),
  body('firstName').trim().notEmpty().withMessage('Prénom requis').isLength({ max: 100 }),
  body('lastName').trim().notEmpty().withMessage('Nom requis').isLength({ max: 100 }),
];

const loginValidator = [
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password').notEmpty().withMessage('Mot de passe requis'),
];

module.exports = { registerValidator, loginValidator };