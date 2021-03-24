//Make back connection
const socket = io.connect('http://localhost:4000');
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var btn = document.getElementById('send');
var people = document.getElementById('top-left');

const username = prompt('Enter your name here:');

//Emit messages
btn.addEventListener('click', function() {
    socket.emit('client message', {
        message: input.value,
        name: username
    });
    console.log(input.value);
    input.value = '';
});

//Listen for incoming messages
socket.on('client message', function(data) {
    var item = document.createElement('li');
    if(data.name == username) {
        item.textContent = `You : ${data.message}`;
        item.classList.add('myMsg');
    }
    else {
        item.textContent = `${data.name} : ${data.message}`;
        item.classList.add('other');
    }
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

//For clients
socket.on('client-no', function(data) {
    people.textContent = `Online: ${data.number}`;
    console.log('Updated client info!');
})
