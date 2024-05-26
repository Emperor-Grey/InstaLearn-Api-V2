const productControllers = require('../controllers/productControllers');

const multer = require('multer');
const router = require('express').Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', productControllers.getAllProducts);
router.get('/:id', productControllers.getProduct);
router.get('/search/:key', productControllers.searchProduct);
router.post(
  '/',
  upload.fields([{ name: 'image' }, { name: 'file' }]),
  productControllers.createProduct
);

module.exports = router;
