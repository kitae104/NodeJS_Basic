# 사용자 처리하기 
1. 모델 생성 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;   // 스키마 생성

const userSchema = new Schema({   // 스키마 정의
  email: {  // 이메일
    type: String,
    required: true
  },
  password: { // 비밀번호
    type: String,
    required: true
  },
  name: { // 이름
    type: String,
    required: true
  },
  status: { // 상태
    type: String,
    default: '새 사용자!'
  },
  posts: [ // 게시물
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
});