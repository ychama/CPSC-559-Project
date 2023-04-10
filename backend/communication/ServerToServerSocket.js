import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { processServerUpdateMessage } from "../communication/WorkspaceSocketTOB.js";

const SERVER_CLIENT_WEBSOCKET_URL = "ws://backend{}:600{}";
const PORT_TEMPLATE = "600{}";

const localId = process.env.SERVER_ID;
const otherIds = process.env.OTHER_SERVERS.split(",");

const localPort = PORT_TEMPLATE.replace(/{}/g, localId);

const serverConnections = {};
const downedServers = new Set();

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getDownedServers = () => { return downedServers; };

const listenForServers = async () => {
  const server = http.createServer();

  // overwrite this port when we create the web socket server
  server.listen(localId, "0.0.0.0", function () { });

  // Set up server
  const webSocketServer = new WebSocketServer({
    port: localPort,
    httpServer: server,
  });

  console.log(`Websocket Server open to other servers on port ${localPort}`);

  // Connection from another server
  webSocketServer.on("connection", function connection(superSocket, req) {
    console.log(" --------> A connection HAS been established");

    superSocket.on("message", function incoming(message) {
      processIncomingMessage(superSocket, message);
    });
  });
};

const connectToOtherServers = async (isDelay) => {
  // Wait for other servers to start
  if (isDelay)
    await delay(10000);

  otherIds.forEach((id) => {
    if (!(id in serverConnections)) {
      // Connect to other servers with a greater Id then this one
      const serverAddress = SERVER_CLIENT_WEBSOCKET_URL.replace(/{}/g, id);

      const inferiorSocket = new WebSocket(serverAddress);

      inferiorSocket.addEventListener("error", console.error);

      inferiorSocket.addEventListener("open", function (event) {
        console.log(`Connected to server ${id}`);

        // send local id
        inferiorSocket.send(`{ "serverId": ${localId} }`);

        downedServers.delete(id);

        // store connection
        serverConnections[id] = inferiorSocket;
      });

      inferiorSocket.addEventListener("close", function (event) {
        downedServers.add(id);

        delete serverConnections[id];

        console.log(
          "---------------------> server is down",
          downedServers
        );
      });

      // receive message
      inferiorSocket.addEventListener("message", function (event) {
        processIncomingMessage(inferiorSocket, event.data);
      });
    }
  });
};

async function broadcastUpdate(
  timeStamp,
  workspaceCode,
  path_id,
  color,
  isAck
) {
  console.log("start broadcastUpdate");
  const update = {
    serverId: parseInt(localId),
    timeStamp: timeStamp,
    workspaceCode: workspaceCode,
    path_id: path_id,
    color: color,
    isAck: isAck,
  };
  const jsonUpdate = JSON.stringify(update);

  for (let id in serverConnections) {
    serverConnections[id].send(jsonUpdate);
  }
  console.log("end broadcastUpdate");
}

function processIncomingMessage(socket, message) {
  try {
    const jsonMsg = JSON.parse(message);

    if (
      jsonMsg.hasOwnProperty("serverId") &&
      jsonMsg.hasOwnProperty("timeStamp") &&
      jsonMsg.hasOwnProperty("workspaceCode") &&
      jsonMsg.hasOwnProperty("path_id") &&
      jsonMsg.hasOwnProperty("color") &&
      jsonMsg.hasOwnProperty("isAck")
    ) {
      processServerUpdateMessage(
        jsonMsg["workspaceCode"],
        jsonMsg["path_id"],
        jsonMsg["color"],
        jsonMsg["serverId"],
        jsonMsg["timeStamp"],
        jsonMsg["isAck"]
      );
    } else if (jsonMsg.hasOwnProperty("serverId")) {
      // This is a server on the client side of the connection telling us what server they are
      console.log(`Connected to server ${jsonMsg.serverId}`);
      connectToOtherServers(false);
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
