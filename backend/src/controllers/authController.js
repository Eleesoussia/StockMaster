const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (e) { next(e); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.json({ success: true, data: { user, token } });
  } catch (e) { next(e); }
}

async function me(req, res, next) {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json({ success: true, data: user });
  } catch (e) { next(e); }
}

async function listUsers(req, res, next) {
  try {
    const users = await authService.listUsers();
    res.json({ success: true, data: users });
  } catch (e) { next(e); }
}

async function updateRole(req, res, next) {
  try {
    const user = await authService.updateUserRole(req.params.id, req.body.role);
    res.json({ success: true, data: user });
  } catch (e) { next(e); }
}

async function toggleActive(req, res, next) {
  try {
    const user = await authService.toggleUserActive(req.params.id);
    res.json({ success: true, data: user });
  } catch (e) { next(e); }
}

module.exports = { register, login, me, listUsers, updateRole, toggleActive };