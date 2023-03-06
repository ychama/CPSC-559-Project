import asyncHandler from "express-async-handler";
import Workspace from "../models/workspaceModel.js";
import { v4 as uuidv4 } from "uuid";

const createWorkspace = asyncHandler(async (req, res) => {
  try {
    let workspaceCode = uuidv4();
    while (await Workspace.findOne({ workspaceCode: workspaceCode }))
      workspaceCode = uuidv4();
    const newWorkspace = await Workspace.create({
      workspaceName: req.body.workspaceName,
      workspaceOwner: req.body.workspaceOwner,
      workspaceColoringBook: req.body.workspaceColoringBook,
      workspaceCode: workspaceCode,
    });
    res.status(200).json(newWorkspace);
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json({ error: errMessage });
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

const getWorkspace = asyncHandler(async (req, res) => {
  try {
    if (!req.params.workspaceCode) {
      res.status(400);
      throw new Error("Workspace code not included in request body.");
    }
    const existingWorkspace = await Workspace.findOne({
      workspaceCode: req.params.workspaceCode,
    });
    if (!existingWorkspace) {
      res.status(400);
      throw new Error(
        "No Workspaces with the code " +
        req.params.workspaceCode +
        " were found."
      );
    }
    res.status(200).json({ existingWorkspace });
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

const updateWorkspace = asyncHandler(async (req, res) => {
  try {
    if (!req.body.workspaceCode) {
      res.status(400);
      throw new Error("Workspace code not included in request body.");
    }
    const query = { workspaceCode: req.body.workspaceCode };
    const update = { workspaceColoringBook: { svgPaths: req.body.svgPaths } };

    Workspace.findOneAndUpdate(query, update, { new: true }, (err, doc) => {
      if (err) {
        res.status(400);
        throw new Error("Error updating Coloring Book.");
      }
      res.status(200).json({ doc });
    });
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

const deleteWorkspace = asyncHandler(async (req, res) => {
  try {
    const existingWorkspace = await User.findOne({
      workspaceCode: req.body.workspaceCode,
    });
    if (!existingWorkspace) {
      res.status(400);
      throw new Error(
        "Workspace with code " + req.body.workspaceCode + " not found."
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

export {
  getWorkspace,
  getAllWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  createWorkspace,
};
