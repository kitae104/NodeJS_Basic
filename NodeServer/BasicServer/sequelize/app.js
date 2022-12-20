const path = require("path");
const morgan = require('morgan');
const models = require('../models');
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const express = require('express');
const { REPL_MODE_SLOPPY } = require("repl");
const customer = require("../models/customer");

//=============================================
// 1 익스프레스 설정
//=============================================
const app = express();

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

//=============================================
// 4 라우터 app.get(...)
//=============================================
app.get('/', (req, res, next) => {      // READ
    models.newCustomer.findAll()
    .then((customers) => {
        res.send(customers);
    })
    .catch((error) => {
        console.error(error);
        next(error);
    });
});

app.get('/customer', (req, res) => {
    res.sendFile(__dirname + '/customer.html')
});

app.post('/customer', (req, res) => {       // CREATE
    let body = req.body;

    models.newCustomer.create({
        name: body.name,
        age: body.age,
        sex: body.sex,
    }).then(result => {
        console.log('customer created..!');
        res.redirect('/customer');
    }).catch(error => {
        console.error(error);
    });
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