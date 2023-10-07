const express = require("express")
const router = express.Router()

// 导入上传视频模块
const tools = require("../../model/tools")

// 导入路由处理模块
const videos_handler = require("../../router_handler/videos_handler")

// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi")
// 导入验证规则
const { deleteVideoSchema } = require("../../schema/videos")

// 上传视频
// router.post("/videos", tools.multer().single("video"), videos_handler.uploadVideos)
// 分片上传视频
router.post("/videos", videos_handler.sliceUploadVideo)
// 合并文件
router.get("/videos/:filename/:suffix", videos_handler.mergeSliceVideo)
// 获取视频
router.get("/videos", videos_handler.getVideos)
// 根据 id 删除视频
router.delete("/videos/:id", expressJoi(deleteVideoSchema), videos_handler.deleteVideo)


module.exports = router