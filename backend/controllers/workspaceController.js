import asyncHandler from "express-async-handler";
import Workspace from "../models/workspaceModel.js";
import { v4 as uuidv4 } from "uuid";
import { postBroadCast } from "../middleware/httpBroadcast.js";
import { UpdateQueue } from "../util/updateQueue.js";
import { updateClients } from "../communication/ToFrontendSocket.js";
import { broadcastUpdate } from "../communication/ServerToServerSocket.js";
import mongoose from "mongoose";

// WORKSPACE CONTROLLER

// This file contains controller functions for the Workspace documents in the backend. This has both HTTP and web socket functions used.
// The Web Socket functions are used in the socket communications (under communication folder)
// The HTTP functions are used for HTTP endpoint functionality (under routes)

// logical timestamp for this object
var localTimeStamp = 0;

// queue for processing messages
const queue = new UpdateQueue();
queue.on("pendingUpdate", () => {
  processEnqueuedUpdate();
});

// Controller function to create a new workspace
const createWorkspace = asyncHandler(async (req, res) => {
  try {
    // Get a new workspace code
    let workspaceCode = uuidv4();
    // Get a new code if that code exists
    while (await Workspace.findOne({ workspaceCode: workspaceCode }))
      workspaceCode = uuidv4();
    if (req.body.workspaceCode) {
      workspaceCode = req.body.workspaceCode;
    }

    // Create the new workspace document in the MongoDB instance using the Workspace model and request body attributes
    // Mongoose handles creating the document in the MongoDB instance
    const newWorkspace = await Workspace.create({
      workspaceCode: workspaceCode,
      workspaceName: req.body.workspaceName,
      workspaceOwner: req.user,
      paths: req.body.paths,
      groupTransform: req.body.groupTransform,
    });
    // Send the created workspace with a success status to the requestor
    res.status(200).json(newWorkspace);
    req.body.workspaceCode = workspaceCode;
  } catch (error) {
    // Respond with any errors
    const errMessage = error.message;
    res.status(400).json({ error: errMessage });
  }
  if (!req.body.isBroadcast) {
    // Broadcast/Push Protocol functionality
    // If this request is not a broadcasted request from another server, then we have to broadcast it to all other servers using the postBroadcast helper function
    postBroadCast(
      "/workspaces/",
      req.body,
      req.headers.authorization.split(" ")[1]
    );
  }
});

// Controller function to get all workspaces that exist in the database
const getAllWorkspaces = asyncHandler(async (req, res) => {
  try {
    // Get all existing workspaces and return them to the requestor with a success status
    const existingWorkspaces = await Workspace.find({});
    res.status(200).json({ existingWorkspaces });
  } catch (error) {
    // Return any errors that occur.
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

// NOT USED

/*const deleteWorkspace = asyncHandler(async (req, res) => {
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
});*/

// Function to get workspace with the workspace code as a parameter
async function getWorkspace(targetWorkspaceCode) {
  // Find a workspace with the specified code
  const existingWorkspace = await Workspace.findOne({
    workspaceCode: targetWorkspaceCode,
  });
  // Return it if it exists, if not return an error
  if (existingWorkspace) {
    return JSON.stringify(existingWorkspace);
  } else {
    throw new Error(`No Workspaces with the code ${workSpaceCode} were found.`);
  }
}

// async function updateWorkspace(
//   targetWorkspaceCode,
//   newPaths,
//   isClient,
//   updateTimeStamp = 0
// ) {
//   if (isClient) {
//     // This server sets the timestamp for the client communications
//     updateTimeStamp = localTimeStamp;
//   } else {
//     // Update the timestamp to max of updateTimeStamp and localTimeStamp
//     localTimeStamp =
//       updateTimeStamp > localTimeStamp ? updateTimeStamp : localTimeStamp;
//   }
//   localTimeStamp += 1; // always increment local timestamp

//   const payload = {
//     workspaceCode: targetWorkspaceCode,
//     paths: newPaths,
//   };

//   queue.enqueue(updateTimeStamp, payload, isClient);
// }

async function updateWorkspace(
  targetWorkspaceCode,
  path_id,
  color,
  isClient,
  updateTimeStamp = 0
) {
  if (isClient) {
    // This server sets the timestamp for the client communications
    updateTimeStamp = localTimeStamp;
  } else {
    // Update the timestamp to max of updateTimeStamp and localTimeStamp
    localTimeStamp =
      updateTimeStamp > localTimeStamp ? updateTimeStamp : localTimeStamp;
  }
  localTimeStamp += 1; // always increment local timestamp

  const payload = {
    workspaceCode: targetWorkspaceCode,
    path_id: path_id,
    color: color,
  };

  queue.enqueue(updateTimeStamp, payload, isClient);
}

// function processEnqueuedUpdate() {
//   while (!queue.isEmpty()) {
//     const update = queue.dequeue();

//     // TODO find out how to update just the part that has changed?

//     // Update our database
//     const query = { workspaceCode: update.payload.workspaceCode };
//     const dbUpdate = { paths: update.payload.paths }; // TODO use the paths were only relevant changes are made

//     Workspace.findOneAndUpdate(query, dbUpdate, { new: true }, (err, doc) => {
//       if (err) {
//         console.log("Error updating Workspace Paths in DB");
//       }
//     });

//     // broadcast all changes to the client
//     updateClients(update.payload.workspaceCode, update.payload.paths); // TODO use the paths were only relevant changes are made

//     // broadcast only client changes to the other servers
//     if (update.isClient) {
//       broadcastUpdate(
//         update.timeStamp,
//         update.payload.workspaceCode,
//         update.payload.paths
//       );
//       // TODO use the paths were only relevant changes are made
//     }
//   }
// }

function processEnqueuedUpdate() {
  while (!queue.isEmpty()) {
    const update = queue.dequeue();

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

    if (update.isClient) {
      broadcastUpdate(update.timeStamp, update.payload.workspaceCode, data);
      // TODO use the paths were only relevant changes are made
    }
  }
}

export {
  getWorkspace,
  getAllWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  createWorkspace,
};
