const express = require("express")
const router = express.Router()

// 导入上传图片模块
const tools = require("../../model/tools")

// 导入路由处理模块
const images_handler = require("../../router_handler/images_handler")

// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi")
// 导入验证规则
const { deleteImageSchema } = require("../../schema/images")

// 上传图片
router.post("/images", tools.multer().single("img"), images_handler.uploadImages)

// 获取图片
router.get("/images", images_handler.getImages)

// 根据 id 删除图片
router.delete("/images/:id", expressJoi(deleteImageSchema), images_handler.deleteImage)


module.exports = router