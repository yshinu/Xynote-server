//导入 mongoose
const mongoose = require('mongoose');
//创建文档的结构对象
//设置集合中文档的属性以及属性值的类型
let VipBookListSchema = new mongoose.Schema({
    title:String,
    content:String,
    addtime:String,
    modifytime:String
})
let VipSchema = new mongoose.Schema({
  email: String,
  books:[VipBookListSchema]
});

//创建模型对象  对文档操作的封装对象
let vipBookListModel = mongoose.model('vipBooklist', VipSchema);

//暴露模型对象
module.exports = vipBookListModel;