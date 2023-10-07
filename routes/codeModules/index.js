const express = require("express")
const router = express.Router()

// 导入路由处理模块
const code_modules_handler = require("../../router_handler/code_modules_handler")

// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi")
// 导入验证规则
const { gotCodeModulesKeySchema, postCodeModulesSchema } = require("../../schema/codeModule")

// 获取 code_modules(datas) 数据
router.get("/modules/:unique_key", expressJoi(gotCodeModulesKeySchema), code_modules_handler.getCodeModulesDatas)

// 更新 code_modules(datas) 数据
router.post("/modules", expressJoi(postCodeModulesSchema), code_modules_handler.postCodeModulesDatas)

module.exports = router