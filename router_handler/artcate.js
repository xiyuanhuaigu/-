// 这是路由处理函数模块

const { date } = require('joi')
const db = require('../db/index')

exports.getArtCates = (req,res) =>{
    const sql = `select * from ev_article_cate where is_delete=0 order by id asc`

    //调用db.query()执行sql语句
    db.query(sql,(err,results) =>{
        if(err) return res.cc(err)
        res.send({
            status:0,
            message:'获取文章分类数据成功',
            data:results
        })
    })
}

exports.addArticleCates = (req,res) =>{
    res.send('ok')
}