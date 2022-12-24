const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//=============================================
// 1 익스프레스 설정
//=============================================
const app = express();

//=============================================
// 2 포트 설정
//=============================================
app.set("port", process.env.PORT);

/* 가상 데이터 */
let fakeUser = {
  username: 'test@test.com',
  password: '1234'
}

//=============================================
// 3 공통 미들웨어  app.use(...)
//=============================================
app.use(express.static(__dirname + "../public"));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('passportExample'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'passportExample',
  cookie: {
    httpOnly:true,
    secure: false,
  }
}));

//=============================================
// 3 패스포트 미들웨어 처리 
//=============================================
app.use(passport.initialize());     // passport 초기화
app.use(passport.session());        // passport session 연동

// 세션 처리 - 로그인에 성공했을 경우 딱 한번 호출되어 사용자의 식별자를 session에 저장
passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user.username);
});

// 세션 처리 - 로그인 후 페이지 방문 마다 사용자의 실제 데이터 주입
passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  done(null, fakeUser);             // req.user에 전달
});

passport.use(new LocalStrategy(
  function(username, password, done){
    if(username === fakeUser.username) {    // 사용자 정보 확인 
      if(password === fakeUser.password){
        return done(null, fakeUser);        // 성공한 경우 
      } else {
        // done(오류여부, 결과값, 실패시 메시지)
        return done(null, false, {message: "password incorrect"});
      }
    } else {
      return done(null, false, {message: "username incorrect"});
    }
  }
));


//=============================================
// 4 라우터 app.get(...)
//=============================================
app.get('/', (req, res) => {
  if(!req.user) {                                 // 로그인 아직 하지 않았을 때
    res.sendFile(__dirname + '/index.html');
  } else {                                        // 로그인 성공시 세션에 req.user 저장
    const user = req.user.username;
    const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <p>${user}님 안녕하세요!</p>
      <button type="button" onclick="location.href='/logout'">Log Out</button>
    </body>
    </html>
    `
    res.send(html);
  }
});

app.post('/login', 
  // 로컬 전략 사용 
  passport.authenticate('local', {failureRedirect: '/'}),   // 로그인 실패시 이동 
  function(req, res){
    res.send("Login success...!");
  }
);

app.get('/logout', function(req, res){
  console.log("로그아웃");
  req.logout();
  res.redirect('/');                              // 로그 아웃 시 이동
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
  res.locals.error = process.env.NODE_ENV !== 'development' ? err : {};
  res.status(err.status || 500);
  res.send('error Occurred');
});

//=============================================
// 7 생성된 서버가 포트를 리스닝
//=============================================
app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 서버 실행 중...");
});