const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// ✅ frontendni public papkadan xizmat qilamiz
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("Foydalanuvchi ulandi:", socket.id);

  // offer signal
  socket.on("offer", (data) => {
    socket.broadcast.emit("offer", data);
  });

  // answer signal
  socket.on("answer", (data) => {
    socket.broadcast.emit("answer", data);
  });

  // candidate signal
  socket.on("candidate", (data) => {
    socket.broadcast.emit("candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("Foydalanuvchi chiqib ketdi:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ Server ${PORT}-portda ishlayapti`));
