const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./db');
const dotenv = require('dotenv');

const server = require('http').createServer(app);
const io = require('socket.io')(server);


dotenv.config()

function getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', { hour12: false });

}
app.use(cors(
    {
        origin: process.env.CLIENT
    }));

io.origins(['https://elenaperers.me:443']);

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