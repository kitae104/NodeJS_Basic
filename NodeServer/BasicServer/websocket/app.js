const path = require("path");
const morgan = require('morgan');
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');

//=============================================
// 1 익스프레스 설정
//=============================================
const app = express();
const webSocket = require('./socket.js');

//=============================================
// 2 포트 설정
//=============================================
app.set("port", process.env.PORT);

//=============================================
// 3 공통 미들웨어  app.use(...)
//=============================================
app.use(express.static(__dirname + "../public"));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('wsExample'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'wsExample',
  cookie: {
    httpOnly:true,
    secure: false,
  }
}));

//=============================================
// 4 라우터 app.get(...)
//=============================================
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//=============================================
// 5 404처리 미들웨어
//=============================================
app.get((req, res) => {
    res.status(404).send("not found");
});

//=============================================
// 6 오류처리
//=============================================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Somethning broke!!");
});

//=============================================
// 7 생성된 서버가 포트를 리스닝
//=============================================
app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 서버 실행 중...");
});