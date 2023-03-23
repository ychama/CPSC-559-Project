import asyncHandler from "express-async-handler";
import Workspace from "../models/workspaceModel.js";
import { v4 as uuidv4 } from "uuid";
import { postBroadCast } from "../middleware/httpBroadcast.js";
import { UpdateQueue } from "../util/updateQueue.js"
import { updateClients } from "../communication/ToFrontendSocket.js"
import { broadcastUpdate } from "../communication/ServerToServerSocket.js"

// logical timestamp for this object
var localTimeStamp = 0;

// queue for processing messages
const queue = new UpdateQueue();
queue.on('pendingUpdate', () => { processEnqueuedUpdate(); } );

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
      workspaceOwner: req.body.workspaceOwner,
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
    postBroadCast("/workspaces/", req.body);
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
    if (existingWorkspace.workspaceOwner != req.params.userName) {
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
};

async function updateWorkspace(targetWorkspaceCode, newPaths, isClient, updateTimeStamp = 0) {
  
  if (isClient) {

    // This server sets the timestamp for the client communications
    updateTimeStamp = localTimeStamp;

  } else {

    // Update the timestamp to max of updateTimeStamp and localTimeStamp
    localTimeStamp = updateTimeStamp > localTimeStamp ? updateTimeStamp : localTimeStamp;
  }
  localTimeStamp += 1;  // always increment local timestamp

  const payload = {
    workspaceCode: targetWorkspaceCode,
    paths: newPaths,
  };
  
  queue.enqueue(updateTimeStamp, payload, isClient)
};

function processEnqueuedUpdate(){

  while(!queue.isEmpty()) {

    const update = queue.dequeue();

    // TODO find out how to update just the part that has changed?

    // Update our database
    const query = { workspaceCode: update.payload.workspaceCode };
    const dbUpdate = { paths: update.payload.paths };  // TODO use the paths were only relevant changes are made

    Workspace.findOneAndUpdate(query, dbUpdate, { new: true }, (err, doc) => {
      if (err) {
        console.log("Error updating Workspace Paths in DB");
      }
    });

    // broadcast all changes to the client
    updateClients(update.payload.workspaceCode, update.payload.paths); // TODO use the paths were only relevant changes are made

    // broadcast only client changes to the other servers
    if(update.isClient) {

      broadcastUpdate(
        update.timeStamp, 
        update.payload.workspaceCode, 
        update.payload.paths
      ); 
      // TODO use the paths were only relevant changes are made
    }
  }
};

export {
  getWorkspace,
  getAllWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  createWorkspace,
};
