var express = require('express');
var router = express.Router();
// 导入 jwt
const jwt = require('jsonwebtoken');
//导入配置文件
const { secret } = require('../configs/config')
//导入 用户的模型
const BookListModel = require('../models/bookListModule');

const md5 = require('md5');

router.get('/booklist', (req, res) => {
    const token = req.headers.yshinu
    jwt.verify(token, secret, (err, data) => {
        BookListModel.findOne({ email: data.email }).then(data => {
            res.json({
                code: '0000',
                email: data.email,
                booklist: data.booklist
            })
        }).catch(()=>{
            BookListModel.create({ email: data.email, booklist: ["默认记事本"] })
            res.json({
                code:'3002',
                msg:'你还没有记事本呢，给你添加了一个默认记事本'
            })
        })
    })
})
router.patch('/booklist', (req, res) => {
    const token = req.headers.yshinu
    const bookname = req.body
    jwt.verify(token, secret, (err, data) => {
        if(err){
            res.json({
                code:'3001',
                msg:'无法识别当前用户'
            })
        }
        BookListModel.findOne({ email: data.email }).then(
            data => {
                data.booklist.unshift(bookname.bookname)
                data.save().then(result=>{
                    res.json({
                        code:'0000',
                        msg:'添加记事本成功',
                        result:result
                    })
                }).catch(err=>console.log(err))
                
            }
        ).catch((err) => {
            console.log(err)
            BookListModel.create({ email: data.email, booklist: ["默认记事本"] })
        })
    })
})

module.exports = router