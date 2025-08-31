import http from "http";
import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// statik fayllar (index.html) uchun
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
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
    // optional: notify peers
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("🚀 Signaling server running on port " + PORT));
