const router = require('express').Router();
const ctrl = require('../controllers/dashboardController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

router.use(auth, role('ADMIN', 'MANAGER'));
router.get('/stats', ctrl.stats);
router.get('/sales-by-day', ctrl.salesByDay);
router.get('/top-products', ctrl.topProducts);
router.get('/products-by-category', ctrl.productsByCategory);

module.exports = router;