const express = require('http');
const { Server } = require('socket.io');
const http = require('http');

const app = http.createServer();
const io = new Server(app, {
  cors: {
    origin: "*",
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('call-user', (data) => {
    io.to(data.to).emit('incoming-call', {
      signal: data.signal,
      from: socket.id
    });
  });

  socket.on('accept-call', (data) => {
    io.to(data.to).emit('call-accepted', data.signal);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Signaling server is running on port ${PORT}`);
});
