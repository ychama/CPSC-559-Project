import http from "http";
import { WebSocketServer } from "ws";
import {
  getWorkspace,
  processClientUpdateMessage,
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
  wsServer.on("connection", function (connection) {
    console.log("User joined workspace");

    // Receive messages
    connection.on("message", function incoming(message) {
      processMessage(connection, message);
    });

    // FE disconnected
    connection.on("close", (code, reason) => {
      console.log(
        `Front end disconnected with code ${code} because: "${reason}"`
      );

      // get rid of client
      var workSpace = connectionToWorkspace[connection];

      // remove the connection from the workspace
      if (Array.isArray(workspaceToConnection[workSpace])) {
        const connectionIndex =
          workspaceToConnection[workSpace].indexOf(connection);
        if (connectionIndex > -1) {
          workspaceToConnection[workSpace].splice(connectionIndex, 1);
        }
      }
      delete connectionToWorkspace[connection];
    });
  });
};

async function updateClients(workspace, data) {
  // Send only to clients who care about this workspace
  const clientSockets = workspaceToConnection[workspace];

  // if (Array.isArray(clientSockets)) {
  //   for (const client of clientSockets) {
  //     client.send(`{ "paths": ${JSON.stringify(paths)} }`);
  //   }
  // }

  if (Array.isArray(clientSockets)) {
    for (const client of clientSockets) {
      client.send(`{ "update_color": ${JSON.stringify(data)} }`);
    }
  }
}

async function processMessage(connection, message) {
  try {
    const jsonMsg = JSON.parse(message);

    // Received new connection
    if (jsonMsg.hasOwnProperty("workspaceCode")) {
      const workspaceCode = jsonMsg["workspaceCode"];

      console.log("Received workspace code from client");

      // map workspace to the connection
      if (workspaceCode in workspaceToConnection) {
        workspaceToConnection[workspaceCode].push(connection);
      } else {
        workspaceToConnection[workspaceCode] = [connection];
      }

      // map connection to the workspace
      connectionToWorkspace[connection] = workspaceCode;

      // send workspace they want
      const workspace = await getWorkspace(workspaceCode);
      connection.send(workspace);

      // Client updated workspace
    } else if (jsonMsg.hasOwnProperty("update_color")) {
      processClientUpdateMessage(
        connectionToWorkspace[connection],
        jsonMsg["update_color"]["path_id"],
        jsonMsg["update_color"]["color"]
      );
    } else {
      throw new Error(`Unrecognize message receivedfrom client: ${message}`);
    }
  } catch (error) {
    console.log(
      `Error processing ws message from FE: ${error}, ${error.stack}`
    );
  }
}

export { startFrontendSocket, updateClients };
