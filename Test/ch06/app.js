const dotenv = require('dotenv');
const express = require("express");
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');

// 가능한 윗쪽에 설정
dotenv.config();

const indexRouter = require('./routes')
const userRouter = require('./routes/user');

const app = express();

app.set('port', process.env.PORT || 3000);      // 포트 설정 - 값 설정

// 탬플릿 엔진
app.set('view engine', 'html');

nunjucks.configure('views', {
    express: app,
    watch: true,
});

// 미들웨어 - 모든 요청시에 함께 사용 - 주소를 정할 수 있음
// 미들웨어 간의 순서 중요함 - 내부적으로 next()를 수행함
app.use(morgan('dev'));

// static 부분은 윗쪽에 위치하는 것이 효율적
// app.use('요청 경로', express.static('실제 경로'));
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(cookieParser(process.env.COOKIE_SECRET));             // 쿠키를 파싱하는 용도
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'connect.sid',
}));

app.use('/', indexRouter)
app.use('/user', userRouter);

app.use(express.json());                                      // json()
app.use(express.urlencoded({extended:true}));      // form을 전달 받을 때 true면 qs 객체 사용

app.use((req, res, next) => {
   console.log("모든 요청에 수행...");
   next();
});

// app.get('/', (req, res, next) => {
//     console.log('GET / 요청에서만 실행됩니다.');
//     next();
// });
//
// app.get('/category/:name', (req, res) => {
//    res.send(`Hello ${req.params.name}`);
// });
//
// app.get("/about", (req, res) => {
//    res.status(200).send("익스프레스 서버 수행중...");
// });

// 오류 처리
app.use((req, res, next) => {
    const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// 에러 처리 미들웨어는 반드시 4개의 매개변수를 사용해야 한다!!
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번에서 익스프레스 서버 실행!!');
});