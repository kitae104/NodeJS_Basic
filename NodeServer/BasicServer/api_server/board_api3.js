const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ 
  path: path.resolve(__dirname, "../.env") 
});

const morgan = require("morgan");
const axios = require("axios");
const url = require("url");
const uuidAPIkey = require('uuid-apikey');
const cors = require('cors');
const express = require("express");

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
// 3-1 정적 파일
app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());    // 모든 라우터에 cors 적용 

// 테스트를 위한 API 키 {apiKey: 'TYVNWE5-M0EM49M-JA9BP9Y-6H3K9DX', uuid: 'd7b75e38-a01d-4226-9292-bb27344734b7'}
const key = {
  apiKey:'TYVNWE5-M0EM49M-JA9BP9Y-6H3K9DX',
  uuid: 'd7b75e38-a01d-4226-9292-bb27344734b7'
}

// 테스트를 위한 게시글 데이터 
let boardList = [];
let numOfBoard = 0;

//=============================================
// 4 라우터 app.get(...)
//=============================================
app.get('/', (req, res) => {
  res.send('This is api.js');
});

app.get('/board', (req, res) => {
  res.send(boardList);
});

app.post('/board', (req, res) => {
  const board = {
    "id": ++numOfBoard,
    "user_id": req.body.user_id,
    "date": new Date(),
    "title": req.body.title, 
    "content": req.body.content,
  };
  boardList.push(board);

  res.redirect('/board');
});

app.put('/board/:id', (req, res) => {
  // req.params.id 값 찾아 리스트에서 삭제
  const findItem = boardList.find((item) => {
    return item.id == +req.params.id
  });

  const idx = boardList.indexOf(findItem);
  boardList.splice(idx, 1);   // 처번째 인자부터 두 번째 인자까지의 인덱스만 남기고 나머지 요소를 없애는 함수

  // 리스트에 새로운 요소 추가
  const board = {
    "id": +req.params.id,
    "user_id": req.params.user_id,
    "date": new Date(),
    "title": req.body.title, 
    "content": req.body.content,
  };
  boardList.push(board);
  res.redirect('/board');
});

app.delete('/board/:id', (req, res) => {
  // req.params.id 값 찾아 리스트에서 삭제
  const findItem = boardList.find((item) => {
    return item.id == +req.params.id;
  });
  const idx = boardList.indexOf(findItem);
  boardList.splice(idx, 1);

  res.redirect('/board');
});

// 게시글 검색 API using uuid-key 
app.get('/board/:apikey/:type', (req, res) => {
  let {type, apikey} = req.params;
  const queryData = url.parse(req.url, true).query;

  if(uuidAPIkey.isAPIKey(apikey) &&uuidAPIkey.check(apikey, key.uuid)){
    if(type === 'search'){    // 키워드로 타이틀 검색 
      const keyword = queryData.keyword;
      const result = boardList.filter((e) => {
        return e.title.includes(keyword);
      });
      res.send(result);
    }
    else if(type === 'user'){
      const user_id = queryData.user_id;
      const result = boardList.filter((e) => {
        return e.user_id === user_id;
      });
      res.send(result);
    }
    else {
      res.send('Wrong URL');
    }
  } else {
    res.send("Wrong API Key");
  }
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
