const express = require('express');
const db = require('../db');
const axios = require('axios');
const router = express.Router();

// 请替换为你的小程序 appid 和 secret
const APPID = 'your_appid';
const SECRET = 'your_secret';

router.post('/', async (req, res) => {
  const { code, nickName, avatarUrl, phoneNumber } = req.body;
  try {
    const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: APPID,
        secret: SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    if (response.status!== 200) {
      console.error('微信接口返回非 200 状态码:', response.data);
      return res.status(500).json({ code: 500, message: '微信接口调用失败' });
    }

    const { openid, session_key } = response.data;

    if (!openid || !session_key) {
      console.error('微信接口返回信息不完整:', response.data);
      return res.status(500).json({ code: 500, message: '微信接口返回信息不完整' });
    }

    const sql = 'SELECT * FROM users WHERE openid = ?';
    db.query(sql, [openid], (err, result) => {
      if (err) {
        console.error('数据库查询出错:', err);
        return res.status(500).json({ code: 500, message: '数据库查询失败' });
      }
      if (result.length > 0) {
        const user = result[0];
        // 更新用户信息
        const updateSql = 'UPDATE users SET nickname = ?, avatar_url = ?, phone = ? WHERE openid = ?';
        db.query(updateSql, [nickName, avatarUrl, phoneNumber, openid], (updateErr) => {
          if (updateErr) {
            console.error('用户信息更新出错:', updateErr);
            return res.status(500).json({ code: 500, message: '用户信息更新失败' });
          }
          res.json({
            code: 200,
            userId: user.id,
            token: session_key,
            userInfo: {
              nickName: nickName,
              avatarUrl: avatarUrl
            }
          });
        });
      } else {
        const insertSql = 'INSERT INTO users (openid, nickname, avatar_url, phone) VALUES (?, ?, ?, ?)';
        db.query(insertSql, [openid, nickName, avatarUrl, phoneNumber], (insertErr, insertResult) => {
          if (insertErr) {
            console.error('用户注册出错:', insertErr);
            return res.status(500).json({ code: 500, message: '用户注册失败' });
          }
          const userId = insertResult.insertId;
          res.json({
            code: 200,
            userId,
            token: session_key,
            userInfo: {
              nickName: nickName,
              avatarUrl: avatarUrl
            }
          });
        });
      }
    });
  } catch (error) {
    console.error('微信接口调用出错:', error);
    res.status(500).json({ code: 500, message: '微信接口调用失败' });
  }
});

module.exports = router;