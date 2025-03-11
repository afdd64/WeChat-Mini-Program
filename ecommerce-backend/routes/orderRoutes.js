const express = require('express')
const router = express.Router()
const db = require('../db')

// 获取订单列表
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id']
  const { status } = req.query

  let sql = `
    SELECT o.*, 
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', p.id,
          'name', p.name,
          'price', p.price,
          'image', p.image,
          'quantity', oi.quantity
        )
      ) AS items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
  `

  const params = [userId]

  // 状态过滤
  if (status && status !== 'all') {
    sql += ' AND o.status = ?'
    params.push(status)
  }

  sql += ' GROUP BY o.id ORDER BY o.created_at DESC'

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ code: 500 })
    res.json({ 
      code: 200, 
      data: results.map(order => ({
        ...order,
        items: JSON.parse(order.items)
      }))
    })
  })
})

module.exports = router