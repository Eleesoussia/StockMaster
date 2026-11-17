const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

async function register(data) {
  const existing = await User.findOne({ where: { email: data.email } });
  if (existing) throw ApiError.conflict('Cet email est déjà utilisé');

  const user = await User.create({
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role || 'CLIENT',
  });

  const token = generateToken(user);
  return { user, token };
}

async function login(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw ApiError.unauthorized('Identifiants invalides');
  if (!user.isActive) throw ApiError.forbidden('Compte désactivé');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw ApiError.unauthorized('Identifiants invalides');

  const token = generateToken(user);
  return { user, token };
}

async function getProfile(userId) {
  const user = await User.findByPk(userId);
  if (!user) throw ApiError.notFound('Utilisateur introuvable');
  return user;
}

async function listUsers() {
  return User.findAll({ order: [['id', 'DESC']] });
}

async function updateUserRole(userId, role) {
  const user = await User.findByPk(userId);
  if (!user) throw ApiError.notFound('Utilisateur introuvable');
  user.role = role;
  await user.save();
  return user;
}

async function toggleUserActive(userId) {
  const user = await User.findByPk(userId);
  if (!user) throw ApiError.notFound('Utilisateur introuvable');
  user.isActive = !user.isActive;
  await user.save();
  return user;
}

module.exports = { register, login, getProfile, listUsers, updateUserRole, toggleUserActive };