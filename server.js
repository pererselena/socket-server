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

if (process.env.NODE_ENV === "production") {
    var url = "https://elenaperers.me";
    var urlPort = 'https://elenaperers.me:443';
} else {
    var url = "http://localhost";
    var urlPort = "http://localhost:3000";
}

app.use(cors(
    {
        origin: url
    }));

io.origins([urlPort]);

io.on('connection', (socket) => {
    socket.on('SEND_MESSAGE', function (data) {
        var message = {
            username: data.username,
            message: data.message,
            time: getCurrentTime()
        }
        io.emit('RECEIVE_MESSAGE', message);
        db.addToDB(message);
    })
    socket.on('REGISTER_USER', function (data) {
        var message = {
            username: data.username,
            message: data.message,
            time: getCurrentTime()
        }
        io.emit('RECEIVE_MESSAGE', message);
        db.addToDB(message);
        username = data.username;
    })
    socket.on('DISCONNECT', function (data) {
        var message = {
            username: data.username,
            message: data.message,
            time: getCurrentTime()
        }
        io.emit('RECEIVE_MESSAGE', message);
        db.addToDB(message);
    })
});

server.listen(3005, function (err) {
    if (err) throw err
    console.log('listening on port 3005')
})