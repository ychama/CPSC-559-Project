import asyncHandler from "express-async-handler";
import Workspace from "../models/workspaceModel.js";
import { v4 as uuidv4 } from "uuid";
import { postBroadCast } from "../middleware/httpBroadcast.js";
import { UpdateQueue } from "../util/updateQueue.js";
import { updateClients } from "../communication/ToFrontendSocket.js";
import { broadcastUpdate } from "../communication/ServerToServerSocket.js";
import mongoose from "mongoose";

const localId = process.env.SERVER_ID;
const otherIds = process.env.OTHER_SERVERS.split(",");

// logical timestamps for this object
var TS = Array(otherIds.length + 2).fill(0);

// queue for processing messages
const queue = new UpdateQueue();
queue.on("pendingUpdate", () => {
  setTimeout(processEnqueuedUpdate, 10);
});

const createWorkspace = asyncHandler(async (req, res) => {
  try {
    let workspaceCode = uuidv4();
    while (await Workspace.findOne({ workspaceCode: workspaceCode }))
      workspaceCode = uuidv4();
    if (req.body.workspaceCode) {
      workspaceCode = req.body.workspaceCode;
    }

    const newWorkspace = await Workspace.create({
      workspaceCode: workspaceCode,
      workspaceName: req.body.workspaceName,
      workspaceOwner: req.user,
      paths: req.body.paths,
      groupTransform: req.body.groupTransform,
    });
    res.status(200).json(newWorkspace);
    req.body.workspaceCode = workspaceCode;
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json({ error: errMessage });
  }
  if (!req.body.isBroadcast) {
    postBroadCast(
      "/workspaces/",
      req.body,
      req.headers.authorization.split(" ")[1]
    );
  }
});

const getAllWorkspaces = asyncHandler(async (req, res) => {
  try {
    const existingWorkspaces = await Workspace.find({});
    // if (!existingWorkspaces) {
    //   res.status(400).json("No Workspaces were found.");
    // }
    res.status(200).json({ existingWorkspaces });
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

// not tested
const deleteWorkspace = asyncHandler(async (req, res) => {
  try {
    const existingWorkspace = await User.findOne({
      workspaceCode: req.params.workspaceCode,
    });
    if (!existingWorkspace) {
      res.status(400);
      throw new Error(
        "Workspace with code " + req.params.workspaceCode + " not found."
      );
    }
    if (existingWorkspace.workspaceOwner != req.user) {
      res.status(400);
      throw new Error(
        "User " +
        req.params.userName +
        " is not the owner of the Workspace: " +
        existingWorkspace.workspaceName
      );
    }
    const workspaceName = existingWorkspace.workspaceName;
    await existingWorkspace.remove();
    res.status(200).json({
      message: "Removed Workspace with name: " + workspaceName,
    });
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json({ error: errMessage });
  }
});

async function getWorkspace(targetWorkspaceCode) {
  const existingWorkspace = await Workspace.findOne({
    workspaceCode: targetWorkspaceCode,
  });

  if (existingWorkspace) {
    return JSON.stringify(existingWorkspace);
  } else {
    throw new Error(`No Workspaces with the code ${workSpaceCode} were found.`);
  }
}

async function processClientUpdateMessage(
  targetWorkspaceCode,
  path_id,
  color
) {
  console.log("start processClientUpdateMessage")

  TS[parseInt(localId)] += 1; // increment local timestamp

  const payload = {
    workspaceCode: targetWorkspaceCode,
    path_id: path_id,
    color: color,
  };
  console.log(payload);
  queue.enqueue(parseInt(localId), TS[parseInt(localId)], payload);

  await broadcastUpdate(TS[parseInt(localId)], targetWorkspaceCode, path_id, color, false);
  console.log("end processClientUpdateMessage")
}

async function processServerUpdateMessage(
  targetWorkspaceCode,
  path_id,
  color,
  serverId,
  updateTimeStamp,
  isAck
) {
  console.log("start processServerUpdateMessage")

  TS[serverId] = updateTimeStamp;

  const payload = {
    workspaceCode: targetWorkspaceCode,
    path_id: path_id,
    color: color,
  };

  if (!isAck) {
    queue.enqueue(serverId, updateTimeStamp, payload);

    if (updateTimeStamp > TS[parseInt(localId)]) {
      TS[parseInt(localId)] = updateTimeStamp;
      await broadcastUpdate(TS[parseInt(localId)], targetWorkspaceCode, path_id, color, true);
    }
  }

  console.log("end processServerUpdateMessage")
}

function checkServerTimeStamps(updateTimeStamp) {
  // console.log("start checkServerTimeStamps")
  for (let i = 0; i < otherIds.length; i++) {
    if (updateTimeStamp > TS[parseInt(otherIds[i])])
      return false;
  }
  return true;
}

function processEnqueuedUpdate() {
  while (!queue.isEmpty()) {
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
      updateClients(update.payload.workspaceCode, data);
    }
  }
}

export {
  getWorkspace,
  getAllWorkspaces,
  processClientUpdateMessage,
  processServerUpdateMessage,
  deleteWorkspace,
  createWorkspace,
};
