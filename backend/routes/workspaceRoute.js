import express from "express";
import {
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  createWorkspace,
  getAllWorkspaces,
} from "../controllers/workspaceController.js";
import loggedIn from "../middleware/userAuth.js";

const workspaceRoute = express.Router();

workspaceRoute.get("/", getAllWorkspaces);
// workspaceRoute.get("/:workspaceCode", getWorkspace);    // change this to get the ws port? nah remove this too
workspaceRoute.post("/", createWorkspace);
workspaceRoute.put("/:workspaceCode", updateWorkspace); // TODO this will be removed
workspaceRoute.delete("/:workspaceCode", deleteWorkspace);

export default workspaceRoute;
