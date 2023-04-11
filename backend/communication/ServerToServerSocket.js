import http from "http";
import Workspace from "../models/workspaceModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import { WebSocketServer, WebSocket } from "ws";
import { processServerUpdateMessage } from "../communication/WorkspaceSocketTOB.js";
import {
  setServerCanvasUpdates,
  setServerHttpUpdates,
  getServerCanvasUpdates,
  getServerHttpUpdates,
  deleteServerCanvasUpdates,
  deleteServerHttpUpdates,
  getTS,
  setTS,
} from "./WorkspaceSocketTOB.js";
const SERVER_CLIENT_WEBSOCKET_URL = "ws://backend{}:600{}";
const PORT_TEMPLATE = "600{}";

const localId = process.env.SERVER_ID;
const otherIds = process.env.OTHER_SERVERS.split(",");

const localPort = PORT_TEMPLATE.replace(/{}/g, localId);

const serverConnections = {};
const downedServers = new Set();

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Get list of servers that have crashed.
export const getDownedServers = () => {
  return downedServers;
};

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
  webSocketServer.on("connection", function connection(superSocket, req) {
    console.log(" --------> A connection HAS been established");

    superSocket.on("message", function incoming(message) {
      processIncomingMessage(superSocket, message);
    });
  });
};

const connectToOtherServers = async (isDelay, reconnectID = "") => {
  // Wait for other servers to start
  if (isDelay) await delay(10000);

  otherIds.forEach((id) => {
    if (
      (reconnectID === "" || id === reconnectID) &&
      !(id in serverConnections)
    ) {
      // Connect to other servers with a greater Id then this one
      const serverAddress = SERVER_CLIENT_WEBSOCKET_URL.replace(/{}/g, id);

      const inferiorSocket = new WebSocket(serverAddress);

      inferiorSocket.addEventListener("error", console.error);

      inferiorSocket.addEventListener("open", function (event) {
        console.log(`Connected to server ${id}`);

        // store connection
        serverConnections[id] = inferiorSocket;

        // send local id
        if (reconnectID === "")
          inferiorSocket.send(`{ "serverId": ${localId} }`);

        if (downedServers.has(String(id))) {
          let serverCanvasUpdate = getServerCanvasUpdates(id);
          let serverHttpUpdate = getServerHttpUpdates(id);

          deleteServerCanvasUpdates(id);
          deleteServerHttpUpdates(id);

          let message = {
            canvasUpdates: serverCanvasUpdate,
            httpUpdates: serverHttpUpdate,
            TS: getTS(),
            otherCanvasUpdates: getServerCanvasUpdates(-1),
            otherHttpUpdates: getServerHttpUpdates(-1),
          };

          setTimeout(() => {
            serverConnections[String(id)].send(JSON.stringify(message));
          }, 1000);
        }
        downedServers.delete(id);
      });

      inferiorSocket.addEventListener("close", function (event) {
        downedServers.add(id);

        delete serverConnections[id];

        setServerCanvasUpdates([], id);

        setServerHttpUpdates([], id);

        console.log("---------------------> server is down", downedServers);
      });

      // receive message
      inferiorSocket.addEventListener("message", function (event) {
        processIncomingMessage(inferiorSocket, event.data);
      });
    }
  });
};

// Broadcasting update to all other servers in the system, this is done to adhere to the push protocol

async function broadcastUpdate(
  timeStamp,
  workspaceCode,
  path_id,
  color,
  isAck
) {
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
}

async function createWorkspace(workspaceInfo) {
  delete workspaceInfo["type"];

  try {
    const newWorkspace = await Workspace.create(workspaceInfo);
  } catch (err) {
    console.log(
      "An error has occured while creating a workspace, after a server has recorvered with the following error ",
      err
    );
  }
}

async function createUser(userInfo) {
  try {
    delete userInfo["type"];

    // Check if the username or email exist in the database
    const userNameExists = await User.exists({
      userName: userInfo["userName"],
    });
    const userEmailExists = await User.exists({
      userEmail: userInfo["userEmail"],
    });

    if (!userEmailExists && !userNameExist) {
      const newUser = await User.create(userInfo);
    }
  } catch (err) {
    console.log(
      "An error has occured while creating a user, after a server has recorvered with the following error ",
      err
    );
  }
}

async function deleteUser(userInfo) {
  delete userInfo["type"];

  try {
    console.log(userInfo);
    const existingUser = await User.findOne(userInfo);

    if (existingUser) {
      await existingUser.remove();
    }
  } catch (err) {
    console.log(
      "An error has occured while deleting a user, after a server has recorvered with the following error ",
      err
    );
  }
}

async function updateUser(userInfo) {
  try {
    delete userInfo["type"];
    const user = await User.findOne({ userName: userInfo["userName"] });

    if (user) {
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        userInfo["request"],
        {
          new: true,
        }
      );
    }
    console.log(userInfo);
  } catch (err) {
    console.log(
      "An error has occured while updating a user, after a server has recorvered with the following error ",
      err
    );
  }
}

async function processIncomingMessage(socket, message) {
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
    } else if (
      jsonMsg.hasOwnProperty("canvasUpdates") ||
      jsonMsg.hasOwnProperty("httpUpdates")
    ) {
      //Manually apply these updates

      let canvasUpdates = jsonMsg["canvasUpdates"];
      let httpUpdates = jsonMsg["httpUpdates"];

      setTS(jsonMsg["TS"]);
      setServerCanvasUpdates(jsonMsg["otherCanvasUpdates"], -1);

      setServerHttpUpdates(jsonMsg["otherHttpUpdates"], -1);

      //We first want to apply all the HTTP updates then apply socket updates

      for (let i = 0; i < httpUpdates.length; i++) {
        if (httpUpdates[i]["type"] === "createWorkspace") {
          createWorkspace(httpUpdates[i]);
        } else if (httpUpdates[i]["type"] === "createUser") {
          createUser(httpUpdates[i]);
        } else if (httpUpdates[i]["type"] === "deleteUser") {
          deleteUser(httpUpdates[i]);
        } else if (httpUpdates[i]["type"] === "updateUser") {
          updateUser(httpUpdates[i]);
        }
      }

      //Apply socket updates
      for (let i = 0; i < canvasUpdates.length; i++) {
        await Workspace.updateOne(
          {
            workspaceCode: canvasUpdates[i]["workSpaceCode"],
          },
          { $set: { "paths.$[element].svgFill": canvasUpdates[i]["color"] } },
          {
            arrayFilters: [
              {
                "element._id": mongoose.Types.ObjectId(
                  canvasUpdates[i]["path_id"]
                ),
              },
            ],
          }
        );
      }
    } else if (jsonMsg.hasOwnProperty("serverId")) {
      // This is a server on the client side of the connection telling us what server they are
      connectToOtherServers(false, String(jsonMsg.serverId));
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
