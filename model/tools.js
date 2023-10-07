const multer = require("multer")
const path = require("path")
const sd = require('silly-datetime')
const mkdirp = require('mkdirp')

const getId = require("./getId")

let tools = {
  multer() {
    const storage = multer.diskStorage({
      // 配置上传目录
      destination: async (req, file, cb) => {
        // 1. 获取当前日期 20220128
        let day = sd.format(new Date(), 'YYYYMMDD');
        // static/upload/20220128
        let extname = path.extname(file.originalname);
        let dir
        if (extname === '.mp4') {
          dir = path.join("static/videos", day)
        } else {
          dir = path.join("static/images", day)
        }
        // 2. 按照日期生成图片储存目录  mkdirp是一个异步方法
        await mkdirp(dir)
        cb(null, dir) // 上传之前上传路径必须存在
      },
      // 修改上传的文件名
      filename: function (req, file, cb) {
        // 1. 获取后缀名
        let extname = path.extname(file.originalname);
        // 2. 根据时间戳生成文件名
        cb(null, getId() + extname)
      }
    })
    const upload = multer({ storage: storage })
    return upload;
  }
}

module.exports = tools