import asyncHandler from "express-async-handler";
import Workspace from "../models/workspaceModel.js";
import { v4 as uuidv4 } from "uuid";
import { postBroadCast } from "../middleware/httpBroadcast.js";
import {
  getServerHttpUpdates,
  setServerHttpUpdates,
} from "../communication/WorkspaceSocketTOB.js";

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

    //Store the changes for downed servers

    let update = {
      workspaceCode: workspaceCode,
      workspaceName: req.body.workspaceName,
      workspaceOwner: req.user,
      paths: req.body.paths,
      groupTransform: req.body.groupTransform,
      type: "createWorkspace",
    };

    let serverHttpUpdates = getServerHttpUpdates();

    for (const [key, value] of Object.entries(serverHttpUpdates)) {
      let tempUpdates = [...value];

      tempUpdates.push(update);

      serverHttpUpdates[key] = tempUpdates;
    }

    setServerHttpUpdates(serverHttpUpdates);

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

// Controller function to get all workspaces that exist in the database
const getOneWorkspace = asyncHandler(async (req, res) => {
  try {
    // Get all existing workspaces and return them to the requestor with a success status
    const existingWorkspace = await Workspace.findOne({
      workspaceCode: req.params.workspaceCode,
    });
    res.status(200).json({ existingWorkspace });
  } catch (error) {
    // Return any errors that occur.
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

// NOT USED
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

export {
  getWorkspace,
  getAllWorkspaces,
  deleteWorkspace,
  createWorkspace,
  getOneWorkspace,
};
