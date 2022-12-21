const { WebSocketServer } = require('ws');
const WebSocket = require('ws');

module.exports = (server) => {
  const wss = new WebSocketServer({server});

  wss.on('connection', (ws, req) => {       // Connection 
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('New Client : ', ip);

    ws.on('message', (message) => {           // 클라이언트로부터 메세지
      console.log(message);
    });

    ws.on('error', (err) => { // 에러처리
      console.error(err);
    });

    ws.on('close', () => {
      console.log('클라이언트 접속 해제', ip);
      clearInterval(ws.interval);             // 인터벌 제거 
    });

    ws.interval = setInterval(() => {         // 서버에서 메시지
      if(ws.readyState === ws.OPEN){          // 동기 상태에서 처리하기 위해 확인 
        ws.send('Message From Server');
      }
    }, 3000);                                 // 3초마다 
  });
};