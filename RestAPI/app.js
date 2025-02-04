const express = require('express');
const figlet = require('figlet');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();
const PORT = 3000;

//==========================================================================================
// figlet을 이용한 콘솔 로고 출력
//==========================================================================================
figlet('ki tae - node js', function (err, data) {
	if (err) {
		console.log('Something went wrong...');
		console.dir(err);
		return;
	}
	console.log(data);
});

//==========================================================================================
// 미들웨어
//==========================================================================================
// app.use(express.urlencoded({ extended: false }));  // application/x-www-form-urlencoded : <form> 태그로 전송된 데이터 처리
app.use(express.json());  // application/json : body-parser 대체

// CORS 설정
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');  // 모든 도메인에서 접근 가능
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');  // 허용 메소드
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // 허용 헤더
  next();
});

app.use('/feed', feedRoutes);  // 라우터 등록

//==========================================================================================
// 서버 실행
//==========================================================================================
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});