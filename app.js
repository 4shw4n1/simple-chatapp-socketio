const express = require('express');
const socket = require('socket.io');

//Setup Server
const app = express();
const port = process.env.PORT || 4000;
const server = app.listen(port, function() {
    console.log('Listening on PORT 4000');
});

//Static files
app.use(express.static('public'));

//Socket setup
const io = socket(server);

let clients = 0;

io.on('connection', function(socket) {
    console.log('A user got connected');
    clients++;
    io.emit('client-no', {number: clients});
    socket.on('disconnect', function() {
        console.log('diconnection');
        clients--;
        io.emit('client-no', {number: clients});
    });
    socket.on('client message', function(data) {
        io.emit('client message', data);
    })
});
