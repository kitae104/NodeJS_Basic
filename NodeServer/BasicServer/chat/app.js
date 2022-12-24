const path = require("path");
const http = require("http");
const morgan = require('morgan');

const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const app = express();

app.set("port", process.env.PORT);

app.use(express.static(__dirname)); 
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.Server(app);
const io = require("socket.io")(server);
let users=[];

server.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 서버 실행 중...");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  let name = "";
  socket.on("has connected", (username) => {
    name = username;
    users.push(username);
    io.emit("has connected", {username: username, usersList: users});
  });

  socket.on("disconnct", () => {
    users.splice(users.indexOf(name), 1);
    io.emit("has disconnected", {username: name, usersList: users});
  });

  socket.on("new message", (data) => {
    io.emit("new message", data);         // 모든 소켓에 메시지 전달 
  });
});
