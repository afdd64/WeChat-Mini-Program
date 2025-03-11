const db = require('../db');

// 获取商品列表
exports.getProducts = (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: '数据库查询失败' });
    } else {
      res.json(result); // 返回商品列表
    }
  });
};

// 获取商品详情
exports.getProductById = (req, res) => {
  const productId = req.params.id;
  const sql = `SELECT * FROM products WHERE id = ${productId}`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: '数据库查询失败' });
    } else if (result.length === 0) {
      res.status(404).json({ error: '商品不存在' });
    } else {
      res.json(result[0]); // 返回商品详情
    }
  });
};