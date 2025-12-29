const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('Client connected', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected', socket.id));
});

// Simple HTTP endpoint to emit notification events from other services
app.post('/emit', (req, res) => {
  const { event = 'notification', payload = {} } = req.body || {};
  io.emit(event, payload);
  res.json({ ok: true, event, payload });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`WS server listening on ${PORT}`));
