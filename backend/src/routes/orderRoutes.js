const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { createOrderValidator, updateOrderStatusValidator } = require('../validators/orderValidator');

router.use(auth);
router.post('/', createOrderValidator, validate, ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.patch('/:id/status', role('ADMIN', 'MANAGER'), updateOrderStatusValidator, validate, ctrl.updateStatus);
router.patch('/:id/cancel', ctrl.cancel);

module.exports = router;