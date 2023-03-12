import { createRequire } from 'module';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const require = createRequire(import.meta.url);
const http = require('http');

const socketPort = 5999;  // hard coded random port for now
const serverId = process.env.SERVER_ID;

const clients = {};

const startClientWebSocket = async () => {
    console.log('Created websocket on port ' + socketPort);
    const server = http.createServer();
    const wsServer = new WebSocketServer({ server });
    server.listen(socketPort, () => {
        console.log(`WebSocket server is running on port ${socketPort}`);
    });
    wsServer.on('connection', function(connection) {
        // Generate a unique code for every user
        const userId = uuidv4();
        console.log(`Recieved a new connection.`);
        connection.send("Hello from server: " + serverId);
        // Store the new connection and handle messages
        clients[userId] = connection;
        console.log(`${userId} connected.`);
        // Receive messages
        connection.on('message', function incoming(message){
            console.log("Received message from client: " + message);
        });
    });
};

export default startClientWebSocket;
