const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');  // Auth middleware to set req.user
const {
  uploadProduct,
  getAllProducts
} = require('../controller/product.controller');

router.post('/upload', protect, uploadProduct);
router.get('/all', getAllProducts);

module.exports = router;

