const express = require('express');
const db = require('../db');
const router = express.Router();

// 用户注册
router.post('/register', (req, res) => {
  const { username, password, phone } = req.body;
  const sql = 'INSERT INTO users (username, password, phone) VALUES (?, ?, ?)';
  db.query(sql, [username, password, phone], (err, result) => {
    if (err) throw err;
    res.json({ message: 'User registered successfully', userId: result.insertId });
  });
});

// 用户登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.json({ message: 'Login successful', user: result[0] });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

module.exports = router;