const express = require('express');     // 노드를 위한 웹 워크프레임
const path = require('path');           // 파일이나 디렉토리의 경로
const morgan = require('morgan');       // 로그 관리를 위한 미들웨어
const nunjucks = require('nunjucks');   // HTML 탬플릿

// 파일로 된 경로들
const {sequelize} = require('./models');
//const indexRouter = require('./routes');
//const usersRouter = require('./routes/users');
//const commentsRouter = require('./routes/comments');

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view_engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

// 데이터베이스 연결하기
sequelize.sync({force: false})
    .then(() => {
        console.log('데이터베이스 연결 성공!!');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// .json()은 JSON형태의 데이터를 해석
// .urlencoded()은 x-www-form-urlencoded형태의 데이터를 해석
app.use(express.json());
app.use(express.urlencoded({extended: false})); // 내장된 querystring모듈을 사용 true의 경우엔 qs모듈 사용

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
//app.use('/comments', commentsRouter);

app.use((req, res, next) => {
   const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
   error.status = 404;
   next(error);
});

// 오류 처리
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});