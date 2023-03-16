import http from 'http';
import { WebSocketServer } from 'ws';
import {
    getWorkspace,
    updateWorkspace,
  } from "../controllers/workspaceController.js";

const socketPort = 5999;  // hard coded random port for now

// maps workspace id to an array of client connections
const workspaceToConnection = {};

// maps connection to a workspace
const connectionToWorkspace = {};

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

async function processMessage(connection, message) {

    try{
        const jsonMsg = JSON.parse(message);

        if(jsonMsg.hasOwnProperty('workspaceCode')){

            const workspaceCode = jsonMsg['workspaceCode'];

            // map workspace to the connection
            if(workspaceCode in workspaceToConnection) {

                workspaceToConnection[workspaceCode].unshift(connection);
            }
            else {
                
                workspaceToConnection[workspaceCode] = [connection];
            }

            // map connection to the workspace
            connectionToWorkspace[connection] = workspaceCode;

            // send workspace they want
            const workspace = await getWorkspace(workspaceCode);
            connection.send(workspace);

        } else if (jsonMsg.hasOwnProperty('paths')) {

            await updateWorkspace(connectionToWorkspace[connection], jsonMsg["paths"]);
            console.log("Updated coloring book");
        } else {
            throw new Error(`Unknown message type received: ${message}`);
        }

    } catch (error) {
        console.log(`Error processing ws message from FE: ${error}, ${error.stack}`);
    }
};

export default startFrontendSocket;
