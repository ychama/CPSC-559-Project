import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { processServerUpdateMessage } from "../communication/WorkspaceSocketTOB.js";

const SERVER_CLIENT_WEBSOCKET_URL = "ws://backend{}:600{}";
const PORT_TEMPLATE = "600{}";

const localId = process.env.SERVER_ID;
const otherIds = process.env.OTHER_SERVERS.split(",");

const localPort = PORT_TEMPLATE.replace(/{}/g, localId);

const serverConnections = {};

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

    let id = -1;

    superSocket.on("message", function incoming(message) {
      const res = processIncomingMessage(superSocket, message);
      if (res != -1) id = res;
    });

    superSocket.on("close", function failure(message, reason) {
      if (!process.env.DOWNED_SERVERS) {
        process.env.DOWNED_SERVERS = String(id) + ",";
      } else {
        process.env.DOWNED_SERVERS = process.env.DOWNED_SERVERS + String(id) + ",";
      }

      delete serverConnections[String(id)];

      console.log(
        "---------------------> server is down",
        process.env.DOWNED_SERVERS
      );
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

      inferiorSocket.addEventListener("error", console.error);

      inferiorSocket.addEventListener("open", function (event) {
        console.log(`Connected to server ${id}`);

        // send local id
        inferiorSocket.send(`{ "serverId": ${localId} }`);

        // store connection
        serverConnections[id] = inferiorSocket;
      });

      inferiorSocket.addEventListener("close", function (event) {
        if (!process.env.DOWNED_SERVERS) {
          process.env.DOWNED_SERVERS = id + ",";
        } else {
          process.env.DOWNED_SERVERS = process.env.DOWNED_SERVERS + id + ",";
        }

        delete serverConnections[id];

        console.log(
          "---------------------> server is down",
          process.env.DOWNED_SERVERS
        );
      });

      // receive message
      inferiorSocket.addEventListener("message", function (event) {
        processIncomingMessage(inferiorSocket, event.data);
      });
    }
  });
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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

      return -1;
    } else if (jsonMsg.hasOwnProperty("serverId")) {
      // This is a server on the client side of the connection telling us what server they are
      console.log(`Connected to server ${jsonMsg.serverId}`);

      // Save connection with id
      serverConnections[jsonMsg["serverId"]] = socket;
      return parseInt(jsonMsg["serverId"]);
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
