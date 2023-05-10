var express = require('express');
var router = express.Router();
// 导入 jwt
const jwt = require('jsonwebtoken');
//导入配置文件
const { secret } = require('../configs/config')
//导入 用户的模型
const BookListModel = require('../models/userNotebooks');

const md5 = require('md5');

router.get('/booklist', (req, res) => {
    const token = req.headers.yshinu
    jwt.verify(token, secret, (err, data) => {
        BookListModel.aggregate([
            { $match: { email: data.email } }, // 过滤出 email 为 '1@qq.com' 的文档
            { $unwind: '$notebooks' }, // 展开 notebooks 数组
            { $group: { _id: '$_id', names: { $push: '$notebooks.name' }, id: { $push: '$notebooks._id' } } } // 将 name 属性变成数组
        ]).then((result) => {
            console.log(result)
            res.json({
                code: '0000',
                msg: '获取成功',
                booklist: result[0].names,
                ids: result[0].id
            })
        }
        )
            .catch(() => {
                BookListModel.create(
                    {
                        email: data.email,
                        notebooks: [
                            {
                                name: '默认笔记本',
                                content: [{
                                    title: '',
                                    text: ''
                                }]
                            }
                        ]
                    }
                )
                res.json({
                    code: '3002',
                    msg: '你还没有记事本呢，给你添加了一个默认记事本'
                })
            })
    })
})
router.patch('/booklist', (req, res) => {
    const token = req.headers.yshinu
    const bookname = req.body
    jwt.verify(token, secret, (err, data) => {
        if (err) {
            res.json({
                code: '3001',
                msg: '无法识别当前用户'
            })
        }
        if (bookname) {
            BookListModel.updateOne(
                { email: data.email },
                { $addToSet: { notebooks: { name: bookname.bookname, content: [{ title: '', text: '' }] } } },
            ).then(() => res.json({
                code: '0000',
                msg: '创建成功哦~'
            }))
            return
        }

    })
})
router.delete('/booklist', (req, res) => {
    const token = req.headers.yshinu
    const { id } = req.body
    jwt.verify(token, secret, (err, data) => {
        if (err) {
            res.json({
                code: '3001',
                msg: '无法识别当前用户'
            })
            return
        }
        BookListModel.updateOne(
            { email: data.email },
            { $pull: { 'notebooks': { _id: id } } }
        ).then(() => {
            res.json({
                code: '0000',
                msg: '删除成功'
            })
        })


    })
})
router.put('/booklist', (req, res) => {
    const token = req.headers.yshinu
    const {modifyId,modifyName} = req.body
    jwt.verify(token, secret, (err, data) => {
        if (err) {
            res.json({
                code: '3001',
                msg: '无法识别当前用户'
            })
        }
        if (modifyId) {
            BookListModel.updateOne(
                { email: data.email,"notebooks._id": modifyId },
                { $set: { "notebooks.$.name": modifyName } },
            ).then(() => res.json({
                code: '0000',
                msg: '修改成功哦~'
            }))
            return
        }

    })
})
module.exports = router