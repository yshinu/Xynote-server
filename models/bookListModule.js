//导入 mongoose
const mongoose = require('mongoose');
//创建文档的结构对象
//设置集合中文档的属性以及属性值的类型
let BookListSchema = new mongoose.Schema({
  //标题
  email:String,
  booklist: [String],
});

//创建模型对象  对文档操作的封装对象
let BookListModel = mongoose.model('booklist', BookListSchema);

//暴露模型对象
module.exports = BookListModel;