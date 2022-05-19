const ws = new WebSocket('ws://' + document.location.hostname + ':8080');

const username = localStorage.getItem('username') || prompt('What username do you want?') || 'anonymus';

localStorage.setItem('username', username)

ws.addEventListener('open', connectionOpen);
ws.addEventListener('message', handleSocketMessage);

function connectionOpen(){
    console.log('WebSockets Connection established');
}

function appendToChatbox({sender, message}){
    const div = document.createElement('div');
    div.className = 'message-row';
    
    //We create it with text content for making it save
    const senderDiv = document.createElement('div');
    senderDiv.textContent = sender + ':';
    senderDiv.className = 'font-weight-bold mr-1';
    
    const messageDiv = document.createElement('div')
    messageDiv.textContent = message;
    messageDiv.className = 'message';

    div.appendChild(senderDiv);
    div.appendChild(messageDiv);

    document.getElementById('message-table').appendChild(div);

}

function handleSocketMessage(e){
    try{
        const realMessage = JSON.parse(e.data)
        const {sender, message} = realMessage
        appendToChatbox({sender,message})
    }catch(error){
        console.log(error);
    }
}


function runHandler(e){
    e.preventDefault();
    
    if(ws.readyState === WebSocket.OPEN){
        const field = document.getElementById('message').value;
        const message = field;
        field.value = '';
        console.log('Trying to send this message: ' + message);

        ws.send(JSON.stringify({
            sender: username,
            message: message
        }))

    }else{
        console.log('Connection not established yet');
    }

}