const express = require("express");
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');

try{
    fs.readdirSync('upload');
} catch (error){
    console.error('upload 폴더가 없어 새로 생성합니다.');
    fs.mkdirSync('upload');
};

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, 'uploads/')
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024},
});

const app = express();

app.set('port', process.env.PORT || 3000);      // 포트 설정 - 값 설정

// 미들웨어 - 모든 요청시에 함께 사용 - 주소를 정할 수 있음
// 미들웨어 간의 순서 중요함 - 내부적으로 next()를 수행함
app.use(morgan('dev'));

// static 부분은 윗쪽에 위치하는 것이 효율적
// app.use('요청 경로', express.static('실제 경로'));
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(cookieParser('kitaepassword'));             // 쿠키를 파싱하는 용도
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'kitaepassword',
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'connect.sid',
}));

// 미들웨어 확장
// app.use('/', (req, res, next) => {
//     if(req.session.id){
//         express.static(__dirname, 'public')(req, res, next)
//     } else {
//         next();
//     }
// })

app.use(express.json());                                      // json()
app.use(express.urlencoded({extended:true}));      // form을 전달 받을 때 true면 qs 객체 사용
app.use(multer().array());


app.use((req, res, next) => {
   console.log("모든 요청에 수행...");
   next();
}
// , (req, res, next) => {
//     try{
//         throw new Error("에러 발생!");
//     } catch(error){
//         next(error);                    // 인수가 있는 경우 에러 처리로 이동
//     }
// }
);

// app.get('/', (req, res) => {
//     // 쿠키 사용하기
//     /*req.cookies;        // {mycookie: 'test'}
//     req.signedCookies;  // 서명된 쿠키
//     res.cookie('name', encodeURIComponent(name), {
//         expires: new Date(),
//         httpOnly: true,
//         path: '/',
//     });
//     res.clearCookie('name', encodeURIComponent(name), {
//        httpOnly: true,
//        path: '/',
//     });*/
//
//     //req.body.name;
//
//     res.sendFile(path.join(__dirname, 'index.html'));   // 현재 경로 + 파일
//     // 한 라우터에서 여러개의 send가 사용되는 오류가 발생함.
//     //res.send('안녕하세요.');
//     //res.json({hello: 'kitae'});
//     //next('route');                  // 값을 넣으면 다음 라우터로 이동
// });

app.get('/', (req, res, next) => {
    console.log('GET / 요청에서만 실행됩니다.');
    next();
});

app.get('/category/:name', (req, res) => {
   res.send(`Hello ${req.params.name}`);
});

app.get("/about", (req, res) => {
   res.status(200).send("익스프레스 서버 수행중...");
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'multipart.html'));
});

app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file);
    res.send('OK');
})

// 오류 처리
app.use((err, req, res, next) => {
    // res.send("404 오류 발생");
    console.error(err);
    res.status(500).send(err.message);
})

// 에러 처리 미들웨어는 반드시 4개의 매개변수를 사용해야 한다!!
app.use((err, req, res, next) => {
    console.error(err);
    res.send("오류가 발생했습니다.");
});

app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행!!');
});