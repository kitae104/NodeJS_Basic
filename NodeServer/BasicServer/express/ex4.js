const express = require('express');

// 1 익스프레스 
const app = express();

// 2 포트 설정 
app.set("port", process.env.PORT || 3000);

// 3 공통 미들웨어  app.use(...)
// 3-1 정적 파일 
app.use(express.static(__dirname + "/public"));

// 4 라우터 app.get(...)
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index2.html");
});

// 5 404처리 미들웨어 

// 6 오류처리 

// 7 생성된 서버가 포트를 리스닝 
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 서버 실행 중...');
});