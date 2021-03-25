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

//For clients
socket.on('client-no', function(data) {
    people.textContent = `Online: ${data.number}`;
    if(data.number == 1) people.classList.add('red');
    else people.classList.add('green');
    console.log('Updated client info!');
})
