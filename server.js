// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  // agar frontend alohida domen bo'lsa, shu yerga frontend domenini qo'ying
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// serve static frontend from /public
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined ${roomId}`);
    // notify other peers in room that a new peer joined
    socket.to(roomId).emit("peer-joined", socket.id);
  });

  // Generic signaling: offer/answer/candidate
  socket.on("offer", ({ to, payload }) => {
    if (!to) return;
    io.to(to).emit("offer", { from: socket.id, payload });
  });

  socket.on("answer", ({ to, payload }) => {
    if (!to) return;
    io.to(to).emit("answer", { from: socket.id, payload });
  });

  socket.on("candidate", ({ to, payload }) => {
    if (!to) return;
    io.to(to).emit("candidate", { from: socket.id, payload });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    // notify rooms that this socket left (optional)
    // you could emit to peers to remove UI etc.
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
