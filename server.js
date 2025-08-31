const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Foydalanuvchi ulandi:", socket.id);

  socket.on("join", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("peer-joined", socket.id);
  });

  socket.on("signal", ({ roomId, data }) => {
    if (data.to) {
      io.to(data.to).emit("signal", { from: socket.id, ...data });
    } else {
      socket.to(roomId).emit("signal", { from: socket.id, ...data });
    }
  });

  socket.on("disconnect", () => {
    console.log("Foydalanuvchi chiqdi:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server ${PORT} portda ishlayapti`));
