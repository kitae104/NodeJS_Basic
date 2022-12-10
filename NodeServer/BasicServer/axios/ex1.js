//

const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

//=============================================
// 1 익스프레스 설정 
//=============================================
const app = express();

//=============================================
// 2 포트 설정 
//=============================================
app.set("port", process.env.PORT || 3000);

//=============================================
// 3 공통 미들웨어  app.use(...)
//=============================================
// 3-1 정적 파일 
app.use(express.static(__dirname + "/public"));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//=============================================
// 4 라우터 app.get(...)
//=============================================
app.get('/airkorea', async (req, res) => {
  const serviceKey = "aIsRditBsUScVGImZFHmF9Ks8mcHAdsVw1Pt6dqB1Eoum2lh0CBnDUX3lDb0S608y61RBcdJTKwLKH%2Ft%2BXVlrg%3D%3D";
  //const serviceKey = "일반 인증키";
  const airUrl = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?";  

  let parmas = encodeURI('serviceKey') + '=' + serviceKey;
  parmas += '&' + encodeURI('numOfRows') + '=' + encodeURI('1');
  parmas += '&' + encodeURI('pageNo') + '=' + encodeURI('1');
  parmas += '&' + encodeURI('dataTerm') + '=' + encodeURI('DAILY');
  parmas += '&' + encodeURI('ver') + '=' + encodeURI('1.3');
  parmas += '&' + encodeURI('stationName') + '=' + encodeURI('마포구');
  parmas += '&' + encodeURI('returnType') + '=' + encodeURI('json')

  const url = airUrl + parmas;

  try {
    const result = await axios.get(url);
    res.json(result.data);  // axios로 받은 결과는 꼭 뒤에 .data를 붙여줘야 함
  } catch (error) {
    console.log(error);
  }
});

//=============================================
// 5 404처리 미들웨어 
//=============================================
app.get((req,res)=>{
	res.status(404).send('not found');
});


//=============================================
// 6 오류처리 
//=============================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Somethning broke!!');
});

//=============================================
// 7 생성된 서버가 포트를 리스닝 
//=============================================
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 서버 실행 중...');
});
