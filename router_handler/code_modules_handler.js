// 导入数据库操作模块
const { db } = require("../db/index")

const { BASE_URL, PORT } = require("../db/index")

// 获取 code_modules(datas) 数据
exports.getCodeModulesDatas = (req, res) => {
  // 定义sql
  const sql = `select * from code_modules where unique_key=?`
  db.query(sql, req.params.unique_key, (err, result) => {
    if (err) return res.cc(err)
    // 查找成功
    if (result.length === 0) return res.cc("无数据", 0)
    res.send({
      code: 200,
      message: "获取数据成功",
      data: result[0]
    })
  })
}
// 更新 codeModules datas 数据
exports.postCodeModulesDatas = (req, res) => {
  const sql = `update code_modules set blocks=?,position=? where unique_key=?`
  db.query(sql, [req.body.blocks, req.body.position, req.body.unique_key], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows === 0) return res.cc(`更新数据失败: ${err}`)
    res.send({
      code: 200,
      message: "更新数据成功",
      data: []
    })
  })
}
