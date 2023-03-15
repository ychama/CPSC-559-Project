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

workspaceRoute.get("/", loggedIn, getAllWorkspaces);
workspaceRoute.get("/:workspaceCode", loggedIn, getWorkspace);
workspaceRoute.post("/", loggedIn, createWorkspace);
workspaceRoute.put("/:workspaceCode", loggedIn, updateWorkspace);
workspaceRoute.delete("/:workspaceCode", loggedIn, deleteWorkspace);

export default workspaceRoute;
