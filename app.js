//Server side JS: will handle requests and send data to all clients

//importing the required modules
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

//Variables to be used
let i = 0;
let clients = 0;
let users = [];
let history = [];

//Handling socket events
io.on('connection', function(socket) {
    const _id = socket.id;
    console.log(_id, 'entered the chat');
    clients++;
    io.emit('client-no', {number: clients});

    //in case of a disconnection
    socket.on('disconnect', function() {
        console.log(_id, 'left the chat');
        clients--;
        //To remove the user from our users array
        for(i = 0; i < users.length; i++)
        {
            if(users[i].id === _id)
            {
                break;
            }
        }
        io.emit('left-chat', users[i]); //send left the chat message
        users.splice(i, 1);
        io.emit('client-no', {number: clients}); //update number of clients
    });

    //A new user joins
    socket.on('enter-chat', function(data) {
        let result = {};
        //Handling the 'name already exists' problem
        for(i = 0; i < users.length; i++)
        {
            if(users[i].name == data.name)
            {
                result['id'] = _id;
                result['name'] = data.name;
                break;
            }
        }
        if(result.id != undefined)
        {
            io.emit('already exist', result);
            console.log('request sent for a new name');
        }
        //Unique name was recieved
        else {
            let obj = {};
            obj['id'] = _id;
            obj['name'] = data.name;
            users.push(obj);
            io.emit('enter-chat', data);
        }
    });

    //Sending back the chat message to all client JS instances
    socket.on('client message', function(data) {
        if(history.length < 20) history.push(data);
        else {
            history.shift();
            history.push(data);
        }
        io.emit('client message', data);
    });
});
