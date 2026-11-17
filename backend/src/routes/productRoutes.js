const router = require('express').Router();
const ctrl = require('../controllers/productController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { createProductValidator, updateProductValidator } = require('../validators/productValidator');

router.get('/', ctrl.list);
router.get('/low-stock', auth, role('ADMIN', 'MANAGER'), ctrl.lowStock);
router.get('/:id', ctrl.getById);
router.post('/', auth, role('ADMIN', 'MANAGER'), createProductValidator, validate, ctrl.create);
router.put('/:id', auth, role('ADMIN', 'MANAGER'), updateProductValidator, validate, ctrl.update);
router.delete('/:id', auth, role('ADMIN', 'MANAGER'), ctrl.remove);

module.exports = router;