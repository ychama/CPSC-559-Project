import http from 'http';
import { WebSocketServer } from 'ws';
import {
    getWorkspace,
    updateWorkspace,
  } from "../controllers/workspaceController.js";

// Clients reach us at this port
const socketPort = 7000; 

// maps workspace id to an array of client connections
let workspaceToConnection = {};

// maps connection to a workspace
let connectionToWorkspace = {};

const startFrontendSocket = async () => {
    
    const server = http.createServer();

    const wsServer = new WebSocketServer({ server });
    server.listen(socketPort, () => {
        console.log(`WebSocket server is running on port ${socketPort}`);
    });

    // On Client Connected
    wsServer.on('connection', function(connection) {

        // Receive messages
        connection.on('message', function incoming(message){
            processMessage(connection, message);
        });

        // FE disconnected
        connection.on('close', () => {

            // get rid of client
            var workSpace = connectionToWorkspace[connection];

            // remove the connection from the workspace
            const connectionIndex = workspaceToConnection[workSpace].indexOf(connection);
            if(connectionIndex > -1) {
                workspaceToConnection[workSpace].splice(connectionIndex, 1);
            }
            delete connectionToWorkspace[connection];
        });
    });
};

async function updateClients(workspace, paths) {

    // Send only to clients who care about this workspace
    const clientSockets = workspaceToConnection[workspace];

    if (Array.isArray(clientSockets)) {

        for (const client of clientSockets) {
    
            client.send(`{ "paths": ${JSON.stringify(paths)} }`);
        }
    }
};

async function processMessage(connection, message) {
    
    try {
        const jsonMsg = JSON.parse(message);

        // Received new connection
        if(jsonMsg.hasOwnProperty('workspaceCode')){

            const workspaceCode = jsonMsg['workspaceCode'];

            console.log("Received workspace code from client");

            // map workspace to the connection
            if(workspaceCode in workspaceToConnection) {

                workspaceToConnection[workspaceCode].push(connection);
            }
            else {
                
                workspaceToConnection[workspaceCode] = [connection];
            }

            // map connection to the workspace
            connectionToWorkspace[connection] = workspaceCode;

            // send workspace they want
            const workspace = await getWorkspace(workspaceCode);
            connection.send(workspace);

        // Client updated workspace 
        } else if (jsonMsg.hasOwnProperty('paths')) {

            updateWorkspace(connectionToWorkspace[connection], jsonMsg["paths"], true);
        } else {
            throw new Error(`Unrecognize message receivedfrom client: ${message}`);
        }

    } catch (error) {
        console.log(`Error processing ws message from FE: ${error}, ${error.stack}`);
    }
};

export {
    startFrontendSocket,
    updateClients,
};
