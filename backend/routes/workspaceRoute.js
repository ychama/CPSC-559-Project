import express from "express";
import loggedIn from "../middleware/userAuth.js";
import {
  //deleteWorkspace,
  createWorkspace,
  getAllWorkspaces,
  getWorkspace,
  getOneWorkspace,
} from "../controllers/workspaceController.js";

// Creating an express route for the workspace endpoints using the controller functions and logged in middleware
// These functions will only be triggered at the endpoint when a requestor's JSON Web Token is authorized successfully
const workspaceRoute = express.Router();

workspaceRoute.get("/", loggedIn, getAllWorkspaces);
workspaceRoute.post("/", loggedIn, createWorkspace);
// These two functions require workspaceCode as a parameter as well.
workspaceRoute.get("/:workspaceCode", loggedIn, getOneWorkspace);
// NOT USED
//workspaceRoute.delete("/:workspaceCode", loggedIn, deleteWorkspace);

export default workspaceRoute;
