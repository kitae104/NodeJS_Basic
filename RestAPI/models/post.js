const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  creator: {
    type: Object,
    required: true,
  },
}, { timestamps: true }); // timestamps : createdAt, updatedAt 필드 자동 생성

module.exports = mongoose.model('Post', postSchema);  // Post 모델 생성