const SocketIO = require('socket.io');

module.exports = (server) => {
  const io = SocketIO(server, {path: '/socket.io'});

  io.on('connection', (socket) => {           // Connection 생성 
    const req = socket.request;               // 소켓 내부에 request를 가지고 있어 이를 이용해 ip 주소 획득
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`New Client : ${ip}, socket.id : ${socket.id}`);  // 각 소켓에 부여된 ID

    // socket.on 이벤트 감지
    socket.on('disconnect', () => {           // 클라이언트로부터 메세지
      console.log(`Client Out : ${ip}, socket.id : ${socket.id}`);
      clearInterval(socket.interval);         // 인터벌 제거 
    });

    socket.on('error', (err) => {             // 에러처리
      // console.error(err);
    });

    socket.on('from client', (data) => {          // 클라이언트가 넘긴 데이터 
      console.log(data);
    });

    socket.interval = setInterval(() => {         // 서버에서 메시지 emit 사용 
      // emit(이벤트명, 메시지)
      socket.emit('from server', 'Message From Server'); // 특정 소켓에만 이벤트 전달 
    }, 3000);                                 // 3초마다 
  });
};