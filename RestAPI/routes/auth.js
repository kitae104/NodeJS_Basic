const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

//===============================
// 회원 가입 
//===============================
router.put("/signup", [
  body("email")
    .isEmail()
    .withMessage("유효한 이메일을 입력하세요.") // 오류 메시지
    .custom((value, { req }) => {
      return User
        .findOne({ email: value }) // 이메일로 사용자를 찾음
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject('이미 사용중인 이메일입니다.');
          }
        });
    })
    .normalizeEmail(), // 이메일 주소 정규화
  body("password")
    .trim()
    .isLength({ min: 5 }),
  body("name")
    .trim()
    .not()
    .isEmpty(),
], authController.signup);

// router.post('/login', authController.login);

module.exports = router;
