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

router.use(allo).post('/reg', (req, res) => {
    const { email, pass } = req.body
    console.log(req.body)
    UserModel.findOne({ email: email })
    .then(data => {
      if (data) {
        console.log(data)
        return res.json({
          code: '2003',
          msg: '已经注册啦',
          data: data.email
        });
      } else {
        const token = jwt.sign({ email, pass }, secret, {
          expiresIn: 60 * 60 * 24 * 7
        });
        UserModel.create({email,pass:md5(pass),isVip:false})
        res.json({
          code: '0000',
          msg: '成功',
          token: token
        });
      }
    })
    .catch(err => {
      return res.json({
        code: '2002',
        msg: '用户名或密码错误~~~',
        data: null
      });
    });
})

module.exports = router