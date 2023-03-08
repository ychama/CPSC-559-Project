import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const WebSocket = require('ws');

const serverId = process.env.SERVER_ID;

const listenForServers = async () => {

    if("LISTEN_PORT" in process.env) {

        // Set up server
        const wss = new WebSocket.Server({ port: process.env.LISTEN_PORT });

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
