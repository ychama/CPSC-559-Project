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
workspaceRoute.get("/:workspaceCode", getWorkspace);
workspaceRoute.post("/", createWorkspace);
workspaceRoute.put("/:workspaceCode", updateWorkspace);
workspaceRoute.delete("/:workspaceCode", deleteWorkspace);

export default workspaceRoute;
