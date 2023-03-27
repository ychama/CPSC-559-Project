import mongoose from "mongoose";
import { svgPath } from "./templateModel.js";

const workspaceSchema = mongoose.Schema({
  workspaceCode: { type: String, required: true },
  workspaceName: { type: String, required: true },
  workspaceOwner: { type: String, required: false },
  groupTransform: { type: String, required: true },
  paths: [svgPath]
});

export default mongoose.model("Workspace", workspaceSchema);
