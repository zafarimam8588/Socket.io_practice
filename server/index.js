const express = require("express");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("message", ({ message, room }) => {
    console.log({ room, message });
    socket.to(room).emit("receive-message", message);
  });
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(5000);
