const express = require("express");
const path = require('path');

const app = express();

app.set('port', process.env.PORT || 3000);      // 포트 설정 - 값 설정

// 미들웨어 - 모든 요청시에 함께 사용
app.use((req, res, next) => {
   console.log("모든 요청에 수행...");
   next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));   // 현재 경로 + 파일
});

app.get('/category/:name', (req, res) => {
   res.send(`Hello ${req.params.name}`);
});

app.get("/about", (req, res) => {
   res.send("익스프레스 서버 수행중...");
});

app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행!');
});