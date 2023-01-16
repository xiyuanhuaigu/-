const express = require('express')
const expressJoi = require('@escook/express-joi')
const router = express.Router()

const user_handler = require('../router_handler/user')
// 导入验证规则的中间件
const {reg_login_schema} = require('../schema/user')

// 注册新用户
router.get('/reguser',expressJoi(reg_login_schema),user_handler.regUser)

// 登录
router.get('/login',expressJoi(reg_login_schema),user_handler.login)



module.exports = router