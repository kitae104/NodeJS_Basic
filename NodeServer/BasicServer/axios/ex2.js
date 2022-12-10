const path = require('path');
const dotenv = require("dotenv");
dotenv.config({path: path.resolve(__dirname, "../.env")})

const morgan = require("morgan");
const axios = require("axios");
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

//=============================================
// 4 라우터 app.get(...)
//=============================================
app.get("/airkorea", async (req, res) => {
  const serviceKey = process.env.airServiceKey;     
  const airUrl = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?";

  let parmas = encodeURI("serviceKey") + "=" + serviceKey;
  parmas += "&" + encodeURI("numOfRows") + "=" + encodeURI("1");
  parmas += "&" + encodeURI("pageNo") + "=" + encodeURI("1");
  parmas += "&" + encodeURI("dataTerm") + "=" + encodeURI("DAILY");
  parmas += "&" + encodeURI("ver") + "=" + encodeURI("1.3");
  parmas += "&" + encodeURI("stationName") + "=" + encodeURI("마포구");
  parmas += "&" + encodeURI("returnType") + "=" + encodeURI("json");

  const url = airUrl + parmas;

  try {
    const result = await axios.get(url);

    const airItem = {
      //"location": result.data.ArpltnInforInqireSvcVo['stationName'], // stationName 을 응답 메시지로 보내주지 않습니다. (최근 변경)
      location: "마포구", //locaition을 직접 명시
      time: result.data.response.body.items[0]["dataTime"], // 시간대
      pm10: result.data.response.body.items[0]["pm10Value"], // pm10 수치
      pm25: result.data.response.body.items[0]["pm25Value"], // pm25 수치
    };

    const badAir = [];
    // pm10은 미세먼지 수치
    if (airItem.pm10 <= 30) {
      badAir.push("좋음😀");
    } else if (airItem.pm10 > 30 && airItem.pm10 <= 80) {
      badAir.push("보통😐");
    } else {
      badAir.push("나쁨😡");
    }

    //pm25는 초미세먼지 수치
    if (airItem.pm25 <= 15) {
      badAir.push("좋음😀");
    } else if (airItem.pm25 > 15 && airItem.pm10 <= 35) {
      badAir.push("보통😐");
    } else {
      badAir.push("나쁨😡");
    }

    res.send(`관측 지역: ${airItem.location} / 관측 시간: ${airItem.time} <br>
        미세먼지 ${badAir[0]} 초미세먼지 ${badAir[1]} 입니다.`);
  } catch (error) {
    console.log(error);
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
