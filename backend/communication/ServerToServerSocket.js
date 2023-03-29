import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { updateWorkspace } from "../controllers/workspaceController.js";

const SERVER_CLIENT_WEBSOCKET_URL = "ws://backend{}:600{}";
const PORT_TEMPLATE = "600{}";

const localId = process.env.SERVER_ID;
const otherIds = process.env.OTHER_SERVERS.split(",");

const localPort = PORT_TEMPLATE.replace(/{}/g, localId);

const serverConnections = {};

const listenForServers = async () => {
  const server = http.createServer();

  // overwrite this port when we create the web socket server
  server.listen(localId, "0.0.0.0", function () {});

  // Set up server
  const webSocketServer = new WebSocketServer({
    port: localPort,
    httpServer: server,
  });
  console.log(`Websocket Server open to other servers on port ${localPort}`);

  // Connection from another server
  webSocketServer.on("connection", function connection(superSocket) {
    superSocket.on("message", function incoming(message) {
      processIncomingMessage(superSocket, message);
    });
  });
};

const connectToOtherServers = async () => {
  // Wait for other servers to start
  await delay(10000);

  otherIds.forEach((id) => {
    // Connect to other servers with a greater Id then this one
    if (localId < id) {
      const serverAddress = SERVER_CLIENT_WEBSOCKET_URL.replace(/{}/g, id);

      const inferiorSocket = new WebSocket(serverAddress);

      inferiorSocket.addEventListener("open", function (event) {
        console.log(`Connected to server ${id}`);

        // send local id
        inferiorSocket.send(`{ "serverId": ${localId} }`);

        // store connection
        serverConnections[id] = inferiorSocket;
      });

      // receive message
      inferiorSocket.addEventListener("message", function (event) {
        processIncomingMessage(inferiorSocket, event.data);
      });
    }
  });
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// async function broadcastUpdate(timeStamp, workspaceCode, paths) {
//   const update = {
//     timeStamp: timeStamp,
//     workspaceCode: workspaceCode,
//     paths: paths,
//   };
//   const jsonUpdate = JSON.stringify(update);

//   for (let id in serverConnections) {
//     serverConnections[id].send(jsonUpdate);
//   }
// }

async function broadcastUpdate(timeStamp, workspaceCode, data) {
  const update = {
    timeStamp: timeStamp,
    workspaceCode: workspaceCode,
    path_id: data["path_id"],
    color: data["color"],
  };
  const jsonUpdate = JSON.stringify(update);

  for (let id in serverConnections) {
    serverConnections[id].send(jsonUpdate);
  }
}

async function processIncomingMessage(socket, message) {
  try {
    const jsonMsg = JSON.parse(message);

    // This is a server on the client side of the connection telling us what server they are
    if (jsonMsg.hasOwnProperty("serverId")) {
      console.log(`Connected to server ${jsonMsg.serverId}`);

      // Save connection with id
      serverConnections[jsonMsg["serverId"]] = socket;

      // Update message from other server
    } else if (
      jsonMsg.hasOwnProperty("timeStamp") &&
      jsonMsg.hasOwnProperty("workspaceCode") &&
      jsonMsg.hasOwnProperty("paths")
    ) {
      updateWorkspace(
        jsonMsg["workspaceCode"],
        jsonMsg["paths"],
        false,
        jsonMsg["timeStamp"]
      );
    } else if (
      jsonMsg.hasOwnProperty("timeStamp") &&
      jsonMsg.hasOwnProperty("workspaceCode") &&
      jsonMsg.hasOwnProperty("path_id") &&
      jsonMsg.hasOwnProperty("color")
    ) {
      updateWorkspace(
        jsonMsg["workspaceCode"],
        jsonMsg["path_id"],
        jsonMsg["color"],
        false,
        jsonMsg["timeStamp"]
      );
    } else {
      throw new Error("Unrecognized message received from another server");
    }
  } catch (error) {
    console.log(
      `Error processing ws message from server: ${error}, ${error.stack}`
    );
  }
}

export { listenForServers, connectToOtherServers, broadcastUpdate };
