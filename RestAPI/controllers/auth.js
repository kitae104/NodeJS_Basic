const { validationResult } = require('express-validator'); // 검증 결과 확인
const bcrypt = require('bcryptjs'); // 비밀번호 암호화  
const User = require('../models/user');


exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const error = new Error('검증 실패!.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12) // 비밀번호 암호화
    .then(hashedPw => { // 암호화된 비밀번호
      const user = new User({ // 사용자 생성
        email: email,
        password: hashedPw,
        name: name
      });
      return user.save(); // 사용자 DB 저장
    })
    .then(result => {
      res.status(201).json({ message: '사용자 생성 성공!', userId: result._id });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};