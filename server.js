// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

// Tell server where to look for files
app.use(express.static('public'));

// Create socket connection
let io = require('socket.io').listen(server);

io.on('connection', function (socket) {
  socket.on('new node', function (msg) {
    io.emit('new node', msg);
  });
  socket.on('new link', function (msg) {
    io.emit('new link', msg);
  });
});