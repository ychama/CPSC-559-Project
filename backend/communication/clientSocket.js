import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const WebSocket = require('ws');
const http = require('http');

const socketPort = 5522;  // hard coded random port for now
const serverId = process.env.SERVER_ID;

const startClientWebSocket = async () => {
    const server = http.createServer();
    server.listen("No port yet", "0.0.0.0", function(){
    });
    const wss = new WebSocket.Server({
        port: socketPort,
        httpServer: server 
    });
    console.log('Starting websocket client on port ' + socketPort);
    wss.on('connection', function connection(ws) {
        // TODO handle client canvas update
        ws.on('message', function incoming(message) {
            console.log('Client Message: %s', message);
        });
        // Send a message
        console.log("Hi from server: " + serverId);
    });
};

export default startClientWebSocket;
