const dotenv = require("dotenv").config();
const path = require("path");
const express = require("express");
const figlet = require("figlet");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
// const cors = require('cors');

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

//==========================================================================================
// 환경 설정
//==========================================================================================
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = 8080;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // 이미지 저장 경로
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4())  // 파일명 중복 방지를 위한 uuid
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true); // 이미지 파일일 경우
  } else {
    cb(null, false);  // 이미지 파일이 아닐 경우
  }
}

//==========================================================================================
// figlet을 이용한 콘솔 로고 출력
//==========================================================================================
figlet("ki tae - node js", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});

//==========================================================================================
// 미들웨어
//==========================================================================================
// app.use(cors());
// app.use(express.urlencoded({ extended: false }));  // application/x-www-form-urlencoded : <form> 태그로 전송된 데이터 처리
app.use(express.json()); // application/json : body-parser 대체
app.use(        
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")  // 이미지 업로드 설정
); 
app.use("/images", express.static(path.join(__dirname, "images"))); // 이미지 경로 설정

// CORS 설정
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // 모든 도메인에서 접근 가능
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  ); // 허용 메소드
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // 허용 헤더
  next();
});

// 라우터 등록
app.use("/feed", feedRoutes); 
app.use("/auth", authRoutes); 

// 에러 핸들러
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500; // 상태 코드
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data }); // 에러 메시지 전달
});

//==========================================================================================
// DB연결 및 서버 실행
//==========================================================================================
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
    const io = require('socket.io')(server);  // Socket.IO 서버 생성
    io.on('connection', (socket) => {
      console.log('클라이언트 연결됨');
    });
  })
  .catch((err) => {
    console.log(err);
  });
