const router = require('express').Router();
const ctrl = require('../controllers/stockController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { stockMovementValidator } = require('../validators/orderValidator');

router.use(auth, role('ADMIN', 'MANAGER'));
router.post('/movements', stockMovementValidator, validate, ctrl.createMovement);
router.get('/movements', ctrl.listMovements);
router.get('/alerts', ctrl.listAlerts);
router.patch('/alerts/:id/read', ctrl.markRead);

module.exports = router;