const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
   cors: {
      origin: '*'
   }
});

io.on('connection', (socket) => {
   console.log('A user connected');

   socket.on('text', () => {
      console.log(';frewrefrrf')
   })
   socket.on('disconnect',  () => {
      console.log('A user disconnected');
   });
});

http.listen(5500, function() {
   console.log('listening on *:5500');
});