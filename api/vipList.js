var express = require('express');
var router = express.Router();
// 导入 jwt
const jwt = require('jsonwebtoken');
//导入配置文件
const { secret } = require('../configs/config')
//导入 用户的模型
const UserModel = require('../models/userModel');
const allo = require('../middlewares/Crossa')
const md5 = require('md5');
const transporter = require("../email/emailSender")
const VipBookList = require('../models/vipBookList')
const vipvalicode = {
    code: 'fuckyou'
}
router.get('/vip', (req, res) => {
    const token = req.headers.yshinu
    jwt.verify(token, secret, (err, data) => {
        if (err) {
            res.json({
                code: '3001',
                msg: '无法识别当前用户'
            })
            return
        }
        UserModel.findOne({ email: data.email }, 'isVip').then(user => {
            res.json({
                code: '0000',
                msg: '查询成功',
                isVip: user.isVip
            })
        }
        )
    })
})
router.get('/vip/vali', (req, res) => {

    const token = req.headers.yshinu
    jwt.verify(token, secret, (err, data) => {
        if (err) {
            res.json({
                code: '3001',
                msg: '无法识别当前用户'
            })
            return
        }
        const randomNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
        const email = data.email;
        const code = randomNumber;
        vipvalicode.code = code
        const mailOptions = {
            from: 'yshinu@foxmail.com',
            to: email,
            subject: '记事本',
            text: `你的记事本验证码是： ${code}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.json({
                    code: '5003',
                    msg: '发送验证码失败，请检查以下您的邮箱是否存在'
                })
            } else {
                res.json({
                    code: "0000",
                    msg: '获取成功！若未收到邮件，请不要使用临时邮箱进行注册.',
                })
            }
        });

    })
})
router.post('/vip/vali', (req, res) => {

    const token = req.headers.yshinu
    const code = req.body.code
    jwt.verify(token, secret, (err, data) => {
        if (err) {
            res.json({
                code: '3001',
                msg: '无法识别当前用户'
            })
            return
        }
        if (code === vipvalicode.code) {
            UserModel.updateOne({ email: data.email }, { isVip: true }).then(() => {
                res.json({
                    code: '0000',
                    msg: '成功为您开通vip服务'
                })
            }).catch(() => {
                res.json({
                    code: '6001',
                    msg: '出现了一点错误，重新登陆试试'
                })
            })
        } else {
            res.json({
                code: '5002',
                msg: "验证码错误"
            })
        }

    })
})

router.get('/vipbooks', (req, res) => {
    const token = req.headers.yshinu
    jwt.verify(token, secret, (err, data) => {
        if (err) {
            res.json({
                code: '3001',
                msg: '无法识别当前用户'
            })
            return
        }
        VipBookList.find({ email: data.email }, 'books._id books.title books.addtime books.modifytime').then(docs => {
            console.log(docs)
            const result = docs[0].books.map(book => {
                return {
                    bookid: book._id,
                    title: book.title,
                    addtime: book.addtime,
                    modifytime: book.modifytime
                }
            })
            res.json({
                code: '0000',
                msg: '获取列表成功',
                list: result
            })
        }).catch(err => console.log(err))
    })
})
router.get('/vipbook/content', (req, res) => {
    const token = req.headers.yshinu
    const code = req.query.code
    console.log(code)
    jwt.verify(token, secret, (err, data) => {
        if (err) {
            res.json({
                code: '3001',
                msg: '无法识别当前用户'
            })
            return
        }
        VipBookList.findOne({ email: data.email, 'books._id': code }, { 'books.$': 1, _id: 0 })
            .exec()
            .then(user => {
                if (!user) {
                    console.log(`No book found with title  for email ${email}`);
                } else {
                    const book = user.books[0];
                    res.json({
                        code: '0000',
                        msh: 'success',
                        content: book
                    })
                }
            })
            .catch(err => {
                console.error(err);
            });
    })
})
router.patch('/vipbooks', (req, res) => {
    const token = req.headers.yshinu
    const { title, content, addtime, modifytime } = req.body
    jwt.verify(token, secret, (err, data) => {
        if (err) {
            res.json({
                code: '3001',
                msg: '无法识别当前用户'
            })
            return
        }
        const book = {
            title: title,
            content: content,
            addtime: addtime,
            modifytime: modifytime
        };
        VipBookList.findOneAndUpdate(
            { email: data.email },
            { $push: { books: book } },
            { new: true },).then((res)=>{
                console.log(res)
            }).then(()=>{
                res.json({
                    code:'0000',
                    msg:'删除成功'
                })
            })
    })
})
router.delete('/vipbooks', (req, res) => {
    const token = req.headers.yshinu
    const  {code}  = req.query
    jwt.verify(token, secret, (err, data) => {
        if (err) {
            res.json({
                code: '3001',
                msg: '无法识别当前用户'
            })
            return
        }
        console.log(data.email,code)
        VipBookList.updateOne(
            { email: data.email },
            { $pull: { books: { _id: code } } }
            ).then(()=>{
                res.json({
                    code:'0000',
                    msg:'删除成功'
                })
            }).catch(err=>console.log('cuole',err))
    })
})
router.put('/vipbooks', (req, res) => {
    const token = req.headers.yshinu
    const { title, content, modifytime,id } = req.body.data
    console.log(req.body)
    jwt.verify(token, secret, (err, data) => {
        if (err) {
            res.json({
                code: '3001',
                msg: '无法识别当前用户'
            })
            return
        }
        const book = {
            title: title,
            content: content,
            modifytime: modifytime
        };
        VipBookList.updateOne(
            { email: data.email ,'books._id':id},
            { $set: { "books.$.content": content,"books.$.modifytime":modifytime,"books.$.title":title } },
            ).then(()=>{
                res.json({
                    code:'0000',
                    msg:'提交成功'
                })
            }).catch
    })
})
module.exports = router