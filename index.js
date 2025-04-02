import express from 'express';
import { createServer } from 'node:http';
import {Server} from 'socket.io';

const app = express();
const server = createServer(app);
const ioServer  = new Server(server);

let userCount = 0;
const users = new Map();

app.use(express.static('frontend/dist'));

ioServer.on('connection', (socket) => {
  userCount++;
  const username = `User${userCount}`;
  users.set(socket.id, username);
  socket.emit('assignUsername', username);
  console.log(`${username} connected with socket ID: ${socket.id}`);

  socket.on('message', (message) => {
    const sender = users.get(socket.id);
    const msgWithSender = { ...message, sender };
    ioServer.emit('message', msgWithSender);
  });
  socket.on('disconnect', () => {
    console.log(`${users.get(socket.id)} disconnected`);
    users.delete(socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
