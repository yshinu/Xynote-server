const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 587,
  secure: false,
  auth: {
    user: 'yshinu@foxmail.com',
    pass: 'thueudoelholjibb'
  }
});

module.exports = transporter