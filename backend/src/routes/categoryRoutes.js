const router = require('express').Router();
const ctrl = require('../controllers/categoryController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { createCategoryValidator, updateCategoryValidator } = require('../validators/categoryValidator');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', auth, role('ADMIN', 'MANAGER'), createCategoryValidator, validate, ctrl.create);
router.put('/:id', auth, role('ADMIN', 'MANAGER'), updateCategoryValidator, validate, ctrl.update);
router.delete('/:id', auth, role('ADMIN', 'MANAGER'), ctrl.remove);

module.exports = router;