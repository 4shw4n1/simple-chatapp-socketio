//Client side JS: will send chat message and recieve other events

//Make back connection
const socket = io.connect('http://localhost:4000');

//Quering the DOM
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var btn = document.getElementById('send');
var people = document.getElementById('top-left');

//Username prompt
let username = '';
do {
    username = prompt('Enter your name here:');
} while(username == '' || username == null);

//Sending username to server
socket.emit('enter-chat', {
    name: username,
});

//In case of already exist problem
//Prompt user to enter again a new name
socket.on('already exist', function(data) {
    console.log('request for new username');
    console.log(data.name, username, data.id, socket.id);
    if((data.name == username) && (data.id == socket.id) )
    {
        do {
            username = prompt('Name already taken, enter a new name:');
        } while(username == '' || username == null);

        socket.emit('enter-chat', {
            name: username,
        });
    }
});

//Sending message to server
btn.addEventListener('click', function() {
    if(input.value != ''){
        socket.emit('client message', {
            message: input.value,
            name: username
        });
        console.log(input.value);
        input.value = '';
    }
});

//For a new user joined
socket.on('enter-chat', function(data) {
    var item = document.createElement('li');
    item.classList.add('red');
    item.textContent = `'${data.name}' entered the chat`;
    messages.appendChild(item);
});

//For a user left the chat
socket.on('left-chat', function(data) {
    var item = document.createElement('li');
    item.classList.add('black');
    item.textContent = `'${data.name}' left the chat`;
    messages.appendChild(item);
});

//Incoming transmission message from server
socket.on('client message', function(data) {
    var item = document.createElement('li');
    var pseudonym = document.createElement('div');
    pseudonym.classList.add('nym');
    var textMsg = document.createElement('div');
    textMsg.classList.add('textMsg');
    if(data.name == username) {
        pseudonym.textContent = `You`;
        textMsg.textContent = data.message;
        item.classList.add('myMsg');
    }
    else {
        pseudonym.textContent = data.name;
        textMsg.textContent = data.message;
        item.classList.add('other');
    }
    messages.appendChild(item);
    item.appendChild(pseudonym);
    item.appendChild(textMsg);
    window.scrollTo(0, document.body.scrollHeight);
});

//Incoming data for number of clients online
socket.on('client-no', function(data) {
    people.textContent = `Active: ${data.number}`;
    people.classList.add('black');
    console.log('Updated client info!');
});