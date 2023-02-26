import mongoose from "mongoose";

const svgPath = mongoose.Schema({
  svgStrokeWidth: String,
  svgStrokeMiterLimit: String,
  svgD: String,
  svgTransform: String,
  svgFill: String,
});

const svgSchema = mongoose.Schema({
  svgName: {
    // Image Name
    type: String,
    required: true,
  },
  groupTransform: String,
  svgPaths: [svgPath],
});

export default mongoose.model("SVG", svgSchema);
