const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
// 引入用户路由
const userRoutes = require('./routes/userRoutes'); 
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const addressRoutes = require('./routes/addressRoutes');
const walletRoutes = require('./routes/walletRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 添加中间件验证用户
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ code: 401 });
  }
  next();
});

// 使用用户路由
app.use('/login', userRoutes); 
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/wallet', walletRoutes);

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