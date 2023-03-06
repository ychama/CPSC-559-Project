import mongoose from "mongoose";

export const svgPath = mongoose.Schema({
  svgStrokeWidth: String,
  svgStrokeMiterLimit: String,
  svgD: String,
  svgTransform: String,
  svgFill: String,
  svgStrokeLinecap: String,
  svgStrokeLineJoin: String,
});

const templateSchema = mongoose.Schema({
  templateName: {
    type: String,
    required: true,
  },
  groupTransform: String,
  paths: [svgPath],
});

export default mongoose.model("Template", templateSchema);
