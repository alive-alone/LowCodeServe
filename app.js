const express = require("express");
const bodyParser = require('body-parser')
const ejs = require("ejs");
const joi = require('joi')
// 创建服务器的实例对象
const app = new express()

// 配置模板引擎
app.engine("html", ejs.__express)
app.set("view engine", "html")

// 配置静态web目录
app.use(express.static("static"))

// 导入并配置 cors 中间件
const cors = require("cors")
app.use(cors())

// 配置解析表单数据的中间件   注意：这个中间件只能解析 application/x-www-form-urlencoded 格式的表单
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
// 配置解析 JSON 格式
app.use(bodyParser.json())

// 一定要在路由之前封装 res.cc 函数
app.use((req, res, next) => {
  // status 默认值为 1，表示失败的情况
  // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 一定要在路由之前配置解析 Token 的中间件
const expressJWT = require("express-jwt")
const config = require("./config/config")
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [{ url: /^\/api/ }, { url: /^\/upload/, methods: ['GET'] }, { url: '/user/login', methods: ['POST'] }] }))

// 定义错误级别的中间件 -> 错误级别中间件必须注册在所有路由之后
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 身份认证失败的错误 (token 过期或者 token 不合法)
  if (err.name === 'UnauthorisedError') return res.cc('身份认证失败!')
  // 未知的错误
  res.cc(err)
})

// 监听端口 端口号建议写成3000以上
app.listen(3000, () => {
  console.log('api server running at http://192.168.0.5:3000')
})