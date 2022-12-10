const express = require("express");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');


// 1 익스프레스 
const app = express();

// 2 포트 설정 
app.set("port", process.env.PORT || 3000);

// 3 공통 미들웨어  app.use(...)
// 3-1 정적 파일 
app.use(express.static(__dirname + "/public"));

// 4 라우터 app.get(...)

// 5 404처리 미들웨어 

// 6 오류처리 

// 7 생성된 서버가 포트를 리스닝 