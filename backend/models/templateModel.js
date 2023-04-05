import mongoose from "mongoose";

// SVG Path model used to store path information for every SVG in the database
// Each field is stored in the database to ensure the SVG is loaded exactly in the frontend.
// This corresponds to one line/shape/coloring block of each canvas. This schema is used in the template schema to store canvas templates and workspace coloring books.
export const svgPath = mongoose.Schema({
  svgStrokeWidth: String,
  svgStrokeMiterLimit: String,
  svgD: String,
  svgTransform: String,
  svgFill: String,
  svgStrokeLinecap: String,
  svgStrokeLineJoin: String,
});

// Template Model used to store SVG templates as an array of paths with the group transform and the name of the template.
// These are displayed to the user in the frontend on the create page, so that a user can create a new workspace with them.
// These are the fields that are required to be stored for each template in the database.
const templateSchema = mongoose.Schema({
  templateName: { type: String, required: true },
  groupTransform: { type: String, required: true },
  paths: [svgPath],
});

export default mongoose.model("Template", templateSchema);
