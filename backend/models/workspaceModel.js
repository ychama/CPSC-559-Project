import mongoose from "mongoose";
import { svgPath } from "./templateModel.js";

// Workspace Model that holds all of the necessary information for a single workspace
// This is stored in the database and retrieved by the backend to be displayed in the frontend on the home page and canvas page
// Updates to the canvas are updates to these documents in the backend.
const workspaceSchema = mongoose.Schema({
  workspaceCode: { type: String, required: true, unique: true },
  workspaceName: { type: String, required: true },
  workspaceOwner: { type: String, required: false },
  groupTransform: { type: String, required: true },
  paths: [svgPath],
});

export default mongoose.model("Workspace", workspaceSchema);
