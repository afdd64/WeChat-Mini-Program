const express = require('express');
const db = require('./db');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const addressRoutes = require('./routes/addressRoutes');
const walletRoutes = require('./routes/walletRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// 解析 JSON 请求体
app.use(express.json());

// 启用 CORS
const cors = require('cors');
app.use(cors());

// 路由
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/login', userRoutes);

// 添加中间件验证用户
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ code: 401 });
  }
  next();
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, message: '服务器错误' });
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});