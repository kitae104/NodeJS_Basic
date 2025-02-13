const { validationResult } = require("express-validator"); // 검증 결과 확인
const bcrypt = require("bcryptjs"); // 비밀번호 암호화
const jwt = require("jsonwebtoken"); // 토큰 생성
const User = require("../models/user");
const e = require("express");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("검증 실패!.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  try {
    const hashedPw = await bcrypt.hash(password, 12); // 비밀번호 암호화
    const user = new User({      // 사용자 생성
      email: email,
      password: hashedPw,
      name: name,
    });
    const result = await user.save(); // 사용자 DB 저장
    res.status(201).json({ message: "사용자 생성 성공!", userId: result._id });      
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }  
};

exports.login = (req, res, next) => {
  const email = req.body.email; // 이메일
  const password = req.body.password; // 비밀번호
  let loadedUser; // 사용자
  User.findOne({ email: email }) // 사용자 찾기
    .then((user) => {
      if (!user) {
        const error = new Error("일치하는 사용자를 찾을 수 없습니다.");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        // 토큰 생성
        {
          email: user.email,
          userId: user._id.toString(),
        },
        "kitae_secret", // 비밀 키
        { expiresIn: "1h" } // 만료 시간
      );
      res.status(200).json({ token: token, userId: user._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
