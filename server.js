const express = require('express');
const app = express();
const cors = require('cors');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

function getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', { hour12: false });

}
app.use(cors(
    {
        credentials: true,
        origin: "https://elenaperers.me"
    }));

io.origins(['https://elenaperers.me:*']);

io.on('connection', (socket) => {
    socket.on('SEND_MESSAGE', function (data) {
        io.emit('RECEIVE_MESSAGE', {
            username: data.username,
            message: data.message,
            time: getCurrentTime()
        });
    })
    socket.on('REGISTER_USER', function (data) {
        io.emit('RECEIVE_MESSAGE', {
            username: data.username,
            message: data.message,
            time: getCurrentTime()
        })
        username = data.username;
    })
    socket.on('DISCONNECT', function (data) {
        io.emit('RECEIVE_MESSAGE', {
            username: username,
            message: "has disconnected",
            time: getCurrentTime()
        })
    })
});

server.listen(3005, function (err) {
    if (err) throw err
    console.log('listening on port 3005')
})