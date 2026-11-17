const router = require('express').Router();
const ctrl = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { registerValidator, loginValidator } = require('../validators/authValidator');

router.post('/register', registerValidator, validate, ctrl.register);
router.post('/login', loginValidator, validate, ctrl.login);
router.get('/me', auth, ctrl.me);
router.get('/users', auth, role('ADMIN'), ctrl.listUsers);
router.patch('/users/:id/role', auth, role('ADMIN'), ctrl.updateRole);
router.patch('/users/:id/toggle', auth, role('ADMIN'), ctrl.toggleActive);

module.exports = router;