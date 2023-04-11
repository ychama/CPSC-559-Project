import Workspace from "../models/workspaceModel.js";
import { UpdateQueue } from "../util/updateQueue.js";
import { updateClients } from "../communication/ToFrontendSocket.js";
import {
  broadcastUpdate,
  getDownedServers,
} from "../communication/ServerToServerSocket.js";
import mongoose from "mongoose";

const localId = process.env.SERVER_ID;
const otherIds = process.env.OTHER_SERVERS.split(",");

// Dictionary that keeps track of all the updates a server has missed
let serverCanvasUpdates = {};
let serverHttpUpdates = {};

// logical timestamps for this object
var TS = Array(otherIds.length + 2).fill(0);

// queue for processing messages
const queue = new UpdateQueue();

const setServerCanvasUpdates = (newUpdates, id = -1) => {
  if (id == -1) {
    serverCanvasUpdates = newUpdates;
    for (const [key, value] of Object.entries(serverCanvasUpdates)) {
      console.log(key, value);
    }
  } else serverCanvasUpdates[id] = newUpdates;
};

const getServerCanvasUpdates = (id = -1) => {
  if (id == -1) return serverCanvasUpdates;
  else return serverCanvasUpdates[id];
};

const setServerHttpUpdates = (newUpdates, id = -1) => {
  if (id == -1) {
    serverHttpUpdates = newUpdates;
    for (const [key, value] of Object.entries(serverHttpUpdates)) {
      console.log(key, value);
    }
  } else serverHttpUpdates[id] = newUpdates;
};

const getServerHttpUpdates = (id = -1) => {
  if (id == -1) return serverHttpUpdates;
  else return serverHttpUpdates[id];
};

const deleteServerCanvasUpdates = (id) => {
  delete serverCanvasUpdates[id];
};

const deleteServerHttpUpdates = (id) => {
  delete serverHttpUpdates[id];
};

const getTS = () => {
  return TS;
};

const setTS = (newTS) => {
  TS = newTS;
};

// Function to process an incoming client canvas update
async function processClientUpdateMessage(targetWorkspaceCode, path_id, color) {
  TS[parseInt(localId)] += 1; // increment local timestamp

  const payload = {
    workspaceCode: targetWorkspaceCode,
    path_id: path_id,
    color: color,
  };
  // Enque the update
  queue.enqueue(parseInt(localId), TS[parseInt(localId)], payload);
  processEnqueuedUpdate();
  await broadcastUpdate(
    TS[parseInt(localId)],
    targetWorkspaceCode,
    path_id,
    color,
    false
  );
}

// Function to process an incoming server canvas update
async function processServerUpdateMessage(
  targetWorkspaceCode,
  path_id,
  color,
  serverId,
  updateTimeStamp,
  isAck
) {
  TS[serverId] = updateTimeStamp;

  const payload = {
    workspaceCode: targetWorkspaceCode,
    path_id: path_id,
    color: color,
  };
  // Enque the update if it is not an acknowledgment
  if (!isAck) queue.enqueue(serverId, updateTimeStamp, payload);
  processEnqueuedUpdate();

  // Check timestamps and ack, broadcast if necessary
  if (!isAck && updateTimeStamp > TS[parseInt(localId)]) {
    TS[parseInt(localId)] = updateTimeStamp;
    await broadcastUpdate(
      TS[parseInt(localId)],
      targetWorkspaceCode,
      path_id,
      color,
      true
    );
  }
}
// Function to check list of timestamps to guarantee consistency
function checkServerTimeStamps(updateTimeStamp) {
  for (let i = 0; i < otherIds.length; i++) {
    let downedServers = getDownedServers();
    if (downedServers.has(otherIds[i])) continue;
    if (updateTimeStamp > TS[parseInt(otherIds[i])]) return false;
  }
  return true;
}

// Function to update workspaces with enqueued updates (priority queue by timestamp)
function processEnqueuedUpdate() {
  if (!queue.isEmpty()) {
    const update = queue.front();

    if (checkServerTimeStamps(update.timeStamp)) {
      queue.dequeue();

      const workspaceCode = update.payload.workspaceCode;
      const path_id = update.payload.path_id;
      const color = update.payload.color;

      Workspace.updateOne(
        {
          workspaceCode: workspaceCode,
        },
        { $set: { "paths.$[element].svgFill": color } },
        { arrayFilters: [{ "element._id": mongoose.Types.ObjectId(path_id) }] },
        (err, doc) => {
          if (err) {
            console.log(err);
            console.log("Error updating Workspace Paths in DB");
          }
        }
      );

      let data = {
        path_id: path_id,
        color: color,
      };
      // Update clients with the workspace code
      updateClients(update.payload.workspaceCode, data);

      let payload = {
        path_id: path_id,
        color: color,
        workSpaceCode: update.payload.workspaceCode,
      };

      for (const [key, value] of Object.entries(serverCanvasUpdates)) {
        let tempUpdates = [...value];

        tempUpdates.push(payload);

        serverCanvasUpdates[key] = tempUpdates;
      }

      console.log("---------->", serverCanvasUpdates);
    }
  }
}

export {
  processClientUpdateMessage,
  processServerUpdateMessage,
  setServerCanvasUpdates,
  setServerHttpUpdates,
  getServerCanvasUpdates,
  getServerHttpUpdates,
  deleteServerCanvasUpdates,
  deleteServerHttpUpdates,
  getTS,
  setTS,
};
