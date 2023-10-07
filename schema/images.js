// 导入定义验证规则的包
const joi = require("joi")

// 定义删除 image -> id 的验证规则
const id = joi.string().required()
exports.deleteImageSchema = {
  params: {
    id: id,
  }
}