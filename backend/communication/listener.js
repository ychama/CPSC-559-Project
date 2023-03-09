import { createRequire } from 'module';
import { WebSocketServer } from 'ws';

const require = createRequire(import.meta.url);
const WebSocket = require('ws');
const http = require('http');

const serverId = process.env.SERVER_ID;

const listenForServers = async () => {

    if("LISTEN_PORT" in process.env) {

        const server = http.createServer();

        server.listen(serverId, "0.0.0.0", function(){

        });

        // Set up server
        const wss = new WebSocket.Server({ 
            port: process.env.LISTEN_PORT, 
            httpServer: server 
        });

        console.log('Starting websocket server on port ' + process.env.LISTEN_PORT);

        // Wire up some logic for the connection event (when a client connects) 
        wss.on('connection', function connection(ws) {

            // Wire up logic for the message event (when a client sends something)
            ws.on('message', function incoming(message) {
                console.log('received: %s', message);
            });
    
            // Send a message
            console.log("Welcome to server " + serverId);
        });
    } else {
        console.log("I am not a good listener " + serverId);
    }
};

export default listenForServers;
