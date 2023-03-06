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

workspaceRoute.get("/getAllWorkspaces", getAllWorkspaces);
workspaceRoute.get("/getWorkspace", getWorkspace);
workspaceRoute.put("/updateWorkspace", updateWorkspace);
workspaceRoute.post("/createWorkspace", createWorkspace);
workspaceRoute.delete("/deleteWorkspace", deleteWorkspace);
export default workspaceRoute;
