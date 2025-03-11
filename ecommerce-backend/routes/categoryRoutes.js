// routes/cartRoutes.js
const express = require('express')
const router = express.Router()
const db = require('../db')

// 获取购物车
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id']
  if (!userId) return res.status(401).json({ code: 401, message: '未登录' })

  db.query(
    'SELECT * FROM cart WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ code: 500, message: '数据库错误' })
      res.json({ code: 200, data: results })
    }
  )
})

// 更新购物车
router.post('/sync', (req, res) => {
  const userId = req.headers['x-user-id']
  const { cartItems } = req.body

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ code: 500, message: '事务启动失败' })

    // 1. 清空原有购物车
    db.query('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
      if (err) return db.rollback(() => { throw err })

      // 2. 批量插入新数据
      if (cartItems.length > 0) {
        const values = cartItems.map(item => [
          userId,
          item.product_id,
          item.quantity,
          item.name,
          item.price,
          item.image
        ])
        
        db.query(
          'INSERT INTO cart (user_id, product_id, quantity, name, price, image) VALUES ?',
          [values],
          (err) => {
            if (err) return db.rollback(() => { throw err })
            db.commit(() => {
              res.json({ code: 200, message: '同步成功' })
            })
          }
        )
      } else {
        db.commit(() => {
          res.json({ code: 200, message: '同步成功' })
        })
      }
    })
  })
})

module.exports = router