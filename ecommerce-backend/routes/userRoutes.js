const express = require('express');
const db = require('../db');
const router = express.Router();
const axios = require('axios');

// 替换为你的小程序 appid 和 secret
const APPID = 'your_appid';
const SECRET = 'your_secret';

router.post('/login', async (req, res) => {
  const { code } = req.body;
  try {
    const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: APPID,
        secret: SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });
    const { openid, session_key } = response.data;
    const sql = 'SELECT * FROM users WHERE openid = ?';
    db.query(sql, [openid], (err, result) => {
      if (err) {
        res.status(500).json({ code: 500, message: '数据库查询失败' });
      } else {
        if (result.length > 0) {
          const user = result[0];
          res.json({
            code: 200,
            userId: user.id,
            token: session_key,
            userInfo: {
              nickName: user.nickname,
              avatarUrl: user.avatar_url
            }
          });
        } else {
          const insertSql = 'INSERT INTO users (openid, nickname, avatar_url) VALUES (?, ?, ?)';
          db.query(insertSql, [openid, null, null], (insertErr, insertResult) => {
            if (insertErr) {
              res.status(500).json({ code: 500, message: '用户注册失败' });
            } else {
              const userId = insertResult.insertId;
              res.json({
                code: 200,
                userId,
                token: session_key,
                userInfo: {
                  nickName: null,
                  avatarUrl: null
                }
              });
            }
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: '微信接口调用失败' });
  }
});

module.exports = router;