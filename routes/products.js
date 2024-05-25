const router = require('express').Router();
const productControllers = require('../controllers/productControllers');
const ProductController = require('../controllers/productControllers');

router.get('/', productControllers.getAllProducts);
router.get('/:id', productControllers.getProduct);
router.get('/search/:key', productControllers.searchProduct);
router.post('/', productControllers.createProduct);

module.exports = router;
