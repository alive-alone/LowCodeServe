// 导入数据库操作模块
const { db } = require("../db/index")
// 导入文件操作模块
const fs = require("fs")
/**
 * 删除文件：fs.unlink(path, callback:(err)=>void)
 * 删除目录：fs.rmdir(path,callback:(err)=>void)
 */

const { SERVER_URL, PORT } = require("../db/index")
// 上传图片
exports.uploadImages = (req, res) => {
  let id = req.file.filename.split(".")
  console.log(req.file.path)
  const sql = 'insert into images set ?'
  // 调用 db.query() 执行 SQL 语句
  db.query(sql, { id: id[0], path: req.file.path }, (err, results) => {
    if (err) return res.send({ err: err })
    if (results.affectedRows === 0) return res.cc(`更新数据失败: ${err}`)
    res.send({
      code: 200,
      message: "上传成功！",
      path: pathSplice([{ path: req.file.path }]),
    })
  })
}
// 获取图片
exports.getImages = (req, res) => {
  const sql = "select * from images"
  db.query(sql, (err, result) => {
    if (err) return res.cc(err)
    // 查找成功
    if (result.length === 0) return res.cc("无数据", 0)
    res.send({
      code: 200,
      message: "获取数据成功",
      data: pathSplice(result)
    })
  })
}
// image path 拼接 SERVER_URL
function pathSplice(images) {
  for (let i = 0; i < images.length; i++) {
    let path = images[i].path.split("\\")
    path[0] = "public"
    images[i].path = `http://${SERVER_URL}:${PORT}/${path.join("/")}`
  }
  return images
}

// 根据 id 删除图片
exports.deleteImage = (req, res) => {
  const searchSql = `select * from images where id=?`
  const deleteSql = `delete from images where id=?`
  db.query(searchSql, req.params.id, (searchErr, searchRes) => {
    if (searchErr) return res.cc(searchErr)
    // 搜索无结果
    if (searchRes.length === 0) return res.cc("删除对象不存在", 0)
    db.query(deleteSql, req.params.id, (error, result) => {
      if (error) return res.cc(error)
      if (result.affectedRows === 0) return res.cc("删除失败", 1)
      deleteImage(searchRes[0].path)
      res.send({
        code: 200,
        message: "删除成功！",
      })
    })
  })
}

// 根据 path 删除指定 image 文件
function deleteImage(path) {
  const searchSql = `select * from images where path=?`
  db.query(searchSql, path, (error, result) => {
    if (error) return console.log(error)
    if (result.length === 0) {
      fs.unlink(path, (err) => {
        if (err) {
          console.log(err)
        }
      })
    }
  })
}
