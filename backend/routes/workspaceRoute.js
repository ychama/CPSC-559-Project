import express from "express";
import {
  deleteWorkspace,
  createWorkspace,
  getAllWorkspaces,
} from "../controllers/workspaceController.js";

const workspaceRoute = express.Router();

workspaceRoute.get("/", getAllWorkspaces);
workspaceRoute.post("/", createWorkspace);
workspaceRoute.delete("/:workspaceCode", deleteWorkspace);

export default workspaceRoute;
