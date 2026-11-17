const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/products', require('./productRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/stock', require('./stockRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API StockMaster v1.0',
    endpoints: {
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      orders: '/api/orders',
      stock: '/api/stock',
      dashboard: '/api/dashboard',
      docs: '/api-docs',
    },
  });
});

module.exports = router;