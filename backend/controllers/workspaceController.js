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

// const updateSVG = asyncHandler(async (req, res) => {
//   try {
//     if (!req.body.templateName) {
//       res.status(400);
//       throw new Error("svgName not included in request body.");
//     }
//     if (!req.body.svgPaths) {
//       res.status(400);
//       throw new Error("svgPaths not included in request body.");
//     }
//     const query = { svgName: req.body.svgName };
//     const update = { svgPaths: req.body.svgPaths };

//     SVG.findOneAndUpdate(query, update, { new: true }, (err, doc) => {
//       if (err) {
//         res.status(400);
//         throw new Error("Error updating SVG.");
//       }
//       res.status(200).json({ doc });
//     });
//   } catch (error) {
//     const errMessage = error.message;
//     res.status(400).json(errMessage);
//   }
// });

// not tested
const updateWorkspace = asyncHandler(async (req, res) => {
  try {
    if (!req.params.workspaceCode) {
      res.status(400);
      throw new Error("Workspace code not included in request body.");
    }
    if (!req.body.paths) {
      res.status(400);
      throw new Error("paths not included in request body.");
    }

    const query = { workspaceCode: req.params.workspaceCode };
    const update = { paths: req.body.paths };

    Workspace.findOneAndUpdate(query, update, { new: true }, (err, doc) => {
      if (err) {
        res.status(400);
        throw new Error("Error updating Workspace Paths");
      }
      res.status(200).json({ doc });
    });
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
  if (!req.body.isBroadcast) putBroadCast(`/workspaces/${req.params.workspaceCode}/`, req.body);
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

export {
  getWorkspace,
  getAllWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  createWorkspace,
};
