const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);


io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('SEND_MESSAGE', function (data) {
        io.emit('RECEIVE_MESSAGE', data);
    })
});

server.listen(3005, function (err) {
    if (err) throw err
    console.log('listening on port 3005')
})