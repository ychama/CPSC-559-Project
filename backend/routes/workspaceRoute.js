import express from "express";
import loggedIn from "../middleware/userAuth.js";
import {
  deleteWorkspace,
  createWorkspace,
  getAllWorkspaces,
  getWorkspace,
} from "../controllers/workspaceController.js";

const workspaceRoute = express.Router();

workspaceRoute.get("/", loggedIn, getAllWorkspaces);
workspaceRoute.get("/:workspaceCode", loggedIn, getWorkspace);
workspaceRoute.post("/", loggedIn, createWorkspace);
workspaceRoute.delete("/:workspaceCode", loggedIn, deleteWorkspace);

export default workspaceRoute;
