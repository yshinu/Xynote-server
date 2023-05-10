const mongoose = require('mongoose');

// 定义笔记内容的子文档
const contentSchema = new mongoose.Schema({
  title: String,
  text: String
});

// 定义笔记本的子文档
const notebookSchema = new mongoose.Schema({
  name: String,
  content: [contentSchema]
});

// 定义主文档
const userBooksSchema = new mongoose.Schema({
  email: String,
  notebooks: [notebookSchema]
});

// 创建模型
const UserNoteBooksModel = mongoose.model('UserBooklist', userSchema);