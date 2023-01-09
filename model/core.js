// const express = require('../../modules/node_modules/express') // 引入express模块
const mysql = require('mysql') // 引入mysql模块
// const bodyParser = require('../../modules/node_modules/body-parser');/*支持post方法*/

// const app = express()  // 创建express的实例
// const port = 3000  // 定义监听端口
//https://www.cnblogs.com/zhengweijie/p/13026539.html
// app.use(bodyParser.json({ limit: '512mb' }));// 添加json解析
// app.use(bodyParser.urlencoded({ limit: '512mb', extended: false }));

// 定义连接的数据库
const connection = mysql.createConnection({
  host: 'localhost',   // 服务器端口
  user: 'root',        // 用户名称
  password: 'Root',  // 密码
  database: 'blog'         // 连接的数据库
});

// 允许接口跨域  这里指定允许所有接口跨域
// app.all('*', function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });


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