const express = require('express')
const router = express.Router()
const db = require('../db')

// 获取钱包余额
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id']
  db.query(
    'SELECT * FROM wallet WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ code: 500 })
      res.json({ 
        code: 200, 
        data: results[0] || { balance: 0 }
      })
    }
  )
})

// 钱包充值
router.post('/recharge', (req, res) => {
  const userId = req.headers['x-user-id']
  const { amount } = req.body

  db.query(
    'INSERT INTO wallet (user_id, balance) VALUES (?, ?) ' +
    'ON DUPLICATE KEY UPDATE balance = balance + ?',
    [userId, amount, amount],
    (err, result) => {
      if (err) return res.status(500).json({ code: 500 })
      res.json({ code: 200 })
    }
  )
})

module.exports = router