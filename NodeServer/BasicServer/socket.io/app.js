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
app.get((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 해당 주소가 없습니다.`);
  error.status = 404;
  next(error);
});

//=============================================
// 6 오류처리
//=============================================
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.send('error Occurred');
});

//=============================================
// 7 생성된 서버가 포트를 리스닝
//=============================================
const server = app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 서버 실행 중...");
});

webSocket(server); // ws와 http 포트 공유