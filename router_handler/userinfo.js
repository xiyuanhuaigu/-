const db = require('../db/index')
const bcrypt = require('bcryptjs')

// 获取用户信息的路由
exports.getUserInfo = (req,res)=>{
    
    const sql = `select id, username, nickname, user_pic from ev_users where id=?`
    
    db.query(sql,req.auth.id,(err,result)=>{
        console.log(req.auth)
        if(err) return res.cc(err)

        if(result.length !== 1 )return res.cc('获取用户信息失败')

        res.send({
            status:0,
            message:'获取用户信息成功',
            data:result[0]
        })
    })

}

//更新用户基本信息的路由
exports.updateUserInfo = (req,res)=>{
    const sql = `update ev_users set ? where id=?`

    db.query(sql,[req.body,req.body.id],(err,results)=>{
        if(err) return res.cc(err)

        if(results.affectedRows !== 1 ) return res.cc('更新用户基本信息失败')

        res.cc('更新用户信息成功', 0)
    })
}

// 更新密码的处理函数
exports.updatePassword = (req,res)=>{
// 根据id执行查询用户的信息
const sql = `select * from ev_users where id=?`
// 执行根据id查询用户信息的SQL语句
db.query(sql,req.auth.id,(err,results)=>{
    if(err) return res.cc(err)
    if(results.length !==1 )return res.cc('用户不存在')

    // 判读密码是否正确
    const compareResult = bcrypt.compareSync(req.body.oldPwd,results[0].password)
    if(!compareResult) return res.cc('旧密码错误')

    const sql = `update ev_users set password=? where id=?`
    const newPwd = bcrypt.hashSync(req.body.newPwd,10)
    
    db.query(sql,[newPwd,req.auth.id],(err,results)=>{
        if(err) return res.cc(err)

        if(results.affectedRows !==1) return res.cc('更新密码失败')

        res.cc('更新密码成功',0)
    })
})
}