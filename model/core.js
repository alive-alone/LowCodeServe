const mysql = require('mysql') // 引入mysql模块

// 定义连接的数据库
const connection = mysql.createConnection({
  host: 'localhost',   // 服务器端口
  user: 'root',        // 用户名称
  password: 'Root',  // 密码
  database: 'blog'         // 连接的数据库
});
connection.connect(function (err) {
  if (err) {
    console.log(`mysql连接失败: ${err}!`);
  } else {
    console.log("mysql连接成功!");
  }
});  // 启动连接数据库

// 监听3000端口
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = mysql