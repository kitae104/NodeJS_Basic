const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const morgan = require("morgan");
const axios = require("axios");
const express = require("express");
const redis = require("redis");

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
  await (async () => {
    /******* 레디스 연결 *******/
    const client = redis.createClient(6379, "127.0.0.1");
    client.on("error", (err) => console.log("Redis Client Error", err));
    await client.connect();

    const cachedItems = await client.lRange("airItems", 0, -1);

    if (cachedItems.length) {
      // data in cache
      res.send(` 데이터가 캐시에 있습니다. <br>
          관측 지역: ${cachedItems[0]} / 관측 시간: ${cachedItems[1]} <br>
          미세먼지 ${cachedItems[2]} 초미세먼지 ${cachedItems[3]} 입니다.`);
    } else {
      // data not in cache
      const serviceKey = process.env.airServiceKey;
      const airUrl =
        "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?";

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
          "location": "마포구", // 지역
          "time": result.data.list[0]["dataTime"], // 시간대
          "pm10": result.data.list[0]["pm10Value"], // pm10 수치
          "pm25": result.data.list[0]["pm25Value"], // pm25 수치
        };
        const badAir = [];
        // pm10은 미세먼지 수치
        if (airItem.pm10 <= 30) {
          badAir.push("좋음😀");
        } else if (pm10 > 30 && pm10 <= 80) {
          badAir.push("보통😐");
        } else {
          badAir.push("나쁨😡");
        }

        //pm25는 초미세먼지 수치
        if (airItem.pm25 <= 15) {
          badAir.push("좋음😀");
        } else if (pm25 > 15 && pm10 <= 35) {
          badAir.push("보통😐");
        } else {
          badAir.push("나쁨😡");
        }

        const airItems = [airItem.location, airItem.time, badAir[0], badAir[1]];
        airItems.forEach((val) => {
          client.rPush("airItems", val); // redis에 저장
        });
        client.expire("airItems", 60 * 60);
        res.send(`캐시된 데이터가 없습니다. 새로고침을 해주세요.`);
      } catch (error) {
        console.log(error);
      }
    }
  })();
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
