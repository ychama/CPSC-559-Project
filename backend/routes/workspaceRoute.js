import express from "express";
import {
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  createWorkspace,
} from "../controllers/workspaceController.js";
import loggedIn from "../middleware/userAuth.js";

const workspaceRoute = express.Router();

workspaceRoute.get("/getWorkspace", loggedIn, getWorkspace);
workspaceRoute.put("/updateWorkspace", loggedIn, updateWorkspace);
workspaceRoute.post("/createWorkspace", loggedIn, createWorkspace);
workspaceRoute.delete("/deleteWorkspace", loggedIn, deleteWorkspace);
export default workspaceRoute;
