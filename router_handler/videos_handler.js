// 导入数据库操作模块
const { db } = require("../db/index")
// 导入文件操作模块
const fs = require("fs")
// 解析from-data格式
const multiparty = require('multiparty')
// 时间格式插件
const sd = require('silly-datetime')
const path = require('path')
const { Buffer } = require('buffer')
const getId = require("../model/getId")
/**
 * 删除文件：fs.unlink(path, callback:(err)=>void)
 * 删除目录：fs.rmdir(path,callback:(err)=>void)
 */

// Temporary path to upload files
const STATIC_TEMPORARY = path.join('static/temporary')

const { BASE_URL, PORT } = require("../db/index")
// 上传视频
exports.uploadVideos = (req, res) => {
  let id = req.file.filename.split(".")
  console.log(req.file.path)
  const sql = 'insert into videos set ?'
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
// 分片上传视频
exports.sliceUploadVideo = (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    let filename = fields.filename[0]
    let hash = fields.hash[0]
    let chunk = files.chunk[0]
    let dir = `${STATIC_TEMPORARY}\\${filename}`
    // console.log(filename, hash, chunk)
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir)
      const buffer = fs.readFileSync(chunk.path)
      const ws = fs.createWriteStream(`${dir}\\${hash}`)
      ws.write(buffer)
      ws.close()
      res.send({
        code: 200,
        message: "上传成功！",
        hash: hash,
      })
    } catch (error) {
      console.error(error)
      res.cc(error)
    }
  })
}
// 合并视频分片
exports.mergeSliceVideo = (req, res) => {
  const day = sd.format(new Date(), 'YYYYMMDD');
  // file path
  const filename = req.params.filename
  const suffix = req.params.suffix
  const STATIC_FILES = path.join(`static/${suffix == 'mp4' ? 'videos' : 'images'}`, day)
  try {
    let len = 0
    const bufferList = fs.readdirSync(`${STATIC_TEMPORARY}\\${filename}`).map((hash, index) => {
      const buffer = fs.readFileSync(`${STATIC_TEMPORARY}\\${filename}\\${index}`)
      len += buffer.length
      return buffer
    });
    //Merge files
    const buffer = Buffer.concat(bufferList, len);
    if (!fs.existsSync(STATIC_FILES)) fs.mkdirSync(STATIC_FILES)
    const ws = fs.createWriteStream(`${STATIC_FILES}\\${filename}.${suffix}`)
    ws.write(buffer);
    ws.close();
    mergeSliceVideoSql(filename, suffix, `${STATIC_FILES}\\${filename}.${suffix}`, res)
  } catch (error) {
    console.error(error);
    res.cc(error)
  }
}

function mergeSliceVideoSql(md5, suffix, path, res) {
  // 将路径写入数据库
  const sql = `insert into ${suffix == 'mp4' ? 'videos' : 'images'} set ?`
  // 调用 db.query() 执行 SQL 语句
  db.query(sql, { id: getId(), path: path, md5: md5 }, (err, results) => {
    if (err) return res.send({ err: err })
    if (results.affectedRows === 0) return res.cc(`更新数据失败: ${err}`)
    res.send({
      code: 200,
      message: "上传成功！",
      path: pathSplice([{ path: path }]),
    })
  })
}
// 获取视频
exports.getVideos = (req, res) => {
  const sql = "select * from videos"
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
// path 拼接 BASE_URL
function pathSplice(videos) {
  for (let i = 0; i < videos.length; i++) {
    let path = videos[i].path.split("\\")
    path[0] = "public"
    videos[i].path = `http://${BASE_URL}:${PORT}/${path.join("/")}`
  }
  return videos
}
// 根据 id 删除视频
exports.deleteVideo = (req, res) => {
  const searchSql = `select * from videos where id=?`
  const deleteSql = `delete from videos where id=?`
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
  const searchSql = `select * from videos where path=?`
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