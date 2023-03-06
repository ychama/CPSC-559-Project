import mongoose from "mongoose";
import SVG from "../models/svgModel.js";

const workspaceSchema = mongoose.Schema({
  workspaceName: {
    type: String,
    required: true,
  },
  workspaceOwner: { type: String, required: true },
  workspaceColoringBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: SVG,
    required: true,
  },
  workspaceCode: { type: String, required: true },
});

export default mongoose.model("Workspace", workspaceSchema);

//64025459e9737e89597fe9b1
