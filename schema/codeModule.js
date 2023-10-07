// 导入定义验证规则的包
const joi = require("joi")

// 定义获取 codeModule datas -> key 的验证规则
const unique_key = joi.string().required()
exports.gotCodeModulesKeySchema = {
  params: {
    unique_key: unique_key,
  }
}

// 定义更新 code_modules datas 的验证规则
const blocks = joi.string().required()
const position = joi.string().required()
exports.postCodeModulesSchema = {
  body: {
    unique_key: unique_key,
    blocks: blocks,
    position: position,
  }
}
