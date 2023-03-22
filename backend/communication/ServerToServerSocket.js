import http from 'http';
import { 
    WebSocketServer, 
    WebSocket,
} from 'ws';

const SERVER_CLIENT_WEBSOCKET_URL = "ws://backend{}:600{}";
const PORT_TEMPLATE = "600{}";

const localId = process.env.SERVER_ID;
const otherIds = process.env.OTHER_SERVERS.split(',');

const localPort = PORT_TEMPLATE.replace(
    /{}/g,
    localId
);

const listenForServers = async () => {

    const server = http.createServer();

    // overwrite this port when we create the web socket server
    server.listen(localId, "0.0.0.0", function(){

    });

    // Set up server
    const webSocketServer = new WebSocketServer({ 
        port: localPort, 
        httpServer: server 
    });
    console.log(`Websocket Server open to other servers on port ${localPort}`);

    // Connection from another server
    webSocketServer.on('connection', function connection(superSocket) {

        superSocket.on('message', function incoming(message) {
            processIncomingMessage(superSocket, message);
        });
    });
};

const connectToOtherServers = async () => {
    
    // Wait for other servers to start
    await delay(10000);

    otherIds.forEach(id => {

        // Connect to other servers with a greater Id then this one
        if(localId < id) {
            const serverAddress = SERVER_CLIENT_WEBSOCKET_URL.replace(
                /{}/g,
                id
            );
            
            const inferiorSocket = new WebSocket(serverAddress);
            
            inferiorSocket.addEventListener('open', function (event) {
                inferiorSocket.send(`{ "serverId": ${localId} }`);
            });
            
            inferiorSocket.addEventListener('message', function (event) {
                processIncomingMessage(inferiorSocket, event.data);
            });

            // TODO store connection?
        }
    });
};

const delay = ms => new Promise(res => setTimeout(res, ms));

async function processIncomingMessage(socket, message) {

    console.log(`Message Received: ${message}`);    // TODO remove
    try{
        const jsonMsg = JSON.parse(message);

        // This is a server on the client side of the connection telling us what server they are
        if(jsonMsg.hasOwnProperty("serverId")) {
            // TODO store connection?
        }

    } catch(error) {
        console.log(`Error processing ws message from server: ${error}, ${error.stack}`);
    }
};

export { 
    listenForServers, 
    connectToOtherServers 
};
