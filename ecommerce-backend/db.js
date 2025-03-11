const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost', // 确保与 Navicat 中的主机一致
  user: 'root',      // 确保与 Navicat 中的用户名一致
  password: '123456', // 确保与 Navicat 中的密码一致
  database: 'ecommerce' // 确保与 Navicat 中的数据库名称一致
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected');
});

module.exports = db;