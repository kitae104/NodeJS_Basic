const { WebSocketServer } = require("ws");
const WebSocket = require("ws");

const wss = new WebSocketServer({port: 3000});

wss.on('connection', function connection(ws){
  ws.on('message', function incoming(message){
    console.log('receive : %s', message);
  });

  ws.send('something');
});