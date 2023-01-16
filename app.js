const express = require('express')
const joi = require('joi')
const app = express()

// 导入并配置cors中间件
const cors = require('cors')
app.use(cors())
// 配置解析表单数据中间件
app.use(express.urlencoded({extended: false}))

// 封装res.cc函数
app.use((req,res,next)=>{
    res.cc = (err,status =1)=>{
        res.send({
            status,
            message:err instanceof Error ? err.message : err
    
        })
    }
    next()
})
// 配置解析token的中间件
const{ expressjwt:expressJWT } = require("express-jwt")
const config = require('./config')
app.use(expressJWT({secret:config.jwtSecretKey,algorithms: ['HS256'] }).unless({path: [/^\/api/]}))

//导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api',userRouter)
//导入并使用用户信息的路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my',userinfoRouter)

// 定义错误级别的中间件
app.use((err,req,res,next)=>{
    if(err instanceof joi.ValidationError) return res.cc(err)
    console.log(err)
    if(err.name === 'UnauthorizedError') return res.cc('身份认证失败')
    res.cc(err)
})



app.listen(3007,()=>{
    console.log('http://127.0.0.1:3007')
})