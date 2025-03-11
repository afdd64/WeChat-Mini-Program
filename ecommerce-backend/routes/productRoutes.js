const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

// 获取商品列表
router.get('/', productController.getProducts);

// 获取商品详情
router.get('/:id', productController.getProductById);

module.exports = router;