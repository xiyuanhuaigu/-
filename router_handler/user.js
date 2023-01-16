const express = require('express')
const router = express.Router()
const db  = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

// 注册新用户
exports.regUser = (req,res)=>{
    const userinfo = req.body

    // if(!userinfo.username||!userinfo.password){
    //     // return res.send({status:1})
    //     return res.cc()
    // }
    console.log(userinfo)
    const sqlStr = `select * from ev_users where username=?`
    db.query(sqlStr,userinfo.username,(err,results)=>{
        if(err){
            return res.cc(err)
        }
        if(results.length >0){
            return res.cc('用户名已被占用')
        }
         userinfo.password = bcrypt.hashSync(userinfo.password,10)

         const sql = `insert into ev_users set ?`

         db.query(sql,{username:userinfo.username,password:userinfo.password},(err,results)=>{
            if(err){
                return res.cc(err)
            }
            if(results.affectedRows !== 1){
                return res.cc('注册失败')
            }
            return res.cc('注册成功',0)
         })
    })
    
}

//登录
exports.login = (req,res)=>{
    // 接收表单数据
    const userinfo = req.body
    // 定义sql语句
    const sql = `select * from ev_users where username=?`
    //执行SQL语句，根据用户名进行查询用户的信息
    db.query(sql,userinfo.username,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length !==1 )return res.cc('登录失败')

        //判断密码是否正确
       const comoareResult= bcrypt.compareSync(userinfo.password,results[0].password)

       if(!comoareResult) return res.cc('登录失败')

       // 服务端生成token
       const user = { ...results[0],password:'', user_pic:''}
       const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn})
       console.log(tokenStr)

       res.send({
        status:0,
        message:'登录成功',
        token:'Bearer '+ tokenStr
       })
    })
}