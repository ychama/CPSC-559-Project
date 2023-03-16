import asyncHandler from "express-async-handler";
import Workspace from "../models/workspaceModel.js";
import { v4 as uuidv4 } from "uuid";
import { postBroadCast, putBroadCast } from "../middleware/httpBroadcast.js";

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

async function updateWorkspace(targetWorkspaceCode, newPath) {
  
  // TODO Add queue to synchronize the replicas
  const query = { workspaceCode: targetWorkspaceCode };
  const update = { paths: newPath };

  Workspace.findOneAndUpdate(query, update, { new: true }, (err, doc) => {
    if (err) {
      throw new Error("Error updating Workspace Paths");
    }
  });
};

export {
  getWorkspace,
  getAllWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  createWorkspace,
};
