// routes/addressRoutes.js
const express = require('express')
const router = express.Router()
const db = require('../db')

// 获取地址列表
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id']
  db.query(
    'SELECT * FROM addresses WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ code: 500, message: '数据库错误' })
      res.json({ code: 200, data: results })
    }
  )
})

// 创建地址
router.post('/', (req, res) => {
  const address = { ...req.body, user_id: req.headers['x-user-id'] }
  db.query('INSERT INTO addresses SET ?', address, (err, result) => {
    if (err) return res.status(500).json({ code: 500, message: '创建失败' })
    res.json({ code: 200, data: result.insertId })
  })
})

module.exports = router