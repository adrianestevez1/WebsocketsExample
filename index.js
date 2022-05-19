const http = require('http');

const express = require('express');
const server = express();
//requiring WebSocket from ws module
// const WebSocket = require('ws');
// const {WebSocketServer} = require('ws'); // We're extracting prop WebSocketServer from ws. Its the same as ws.WebSocketServer

// const wss = new WebSocket('wss://localhost:3001', {
//     perMessageDeflate: false,
//     port: 3001
// });
// //Creating the web sockets server
// // const wss = new WebSocketServer('ws://localhost', {port: 3001});
// // const wss = new WebSocketServer({port: 8080});

const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 8080,
    clientTracking: true,
});

wss.on('connection', function connection(ws){
    ws.on('message', function message(e){
        const rawMessage = Buffer.from(e).toString();
        try{
            const {sender,message} = JSON.parse(rawMessage);    
            for(const client of wss.clients){
                if(client.readyState === WebSocket.OPEN){
                    client.send(
                        JSON.stringify({
                            sender,message
                        })
                    );
                }
            }
        }catch(e){
            console.log(e);
        }
    });
});
  
server.use(express.static('public'));

server.listen(3000, function(){
    console.log('Server running at port 3000');
});

