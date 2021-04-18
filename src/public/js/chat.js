const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const socket = io();



socket.on('new_msg', (mesg) => {
    outuputMessage(mesg)

    chatMessages.scrollTop = chatMessages.scrollHeight
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value

    socket.emit('ChatMessage', msg)

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})



outuputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    const timeNow = new Date(message.time).toLocaleTimeString()
    console.log(timeNow)
    div.innerHTML = `	
    <p class="meta">${message.username} <span>${timeNow}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}