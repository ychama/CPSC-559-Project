import mongoose from "mongoose";

const svgPath = mongoose.Schema({
  svgStrokeWidth: String,
  svgStrokeMiterLimit: String,
  svgD: String,
  svgTransform: String,
  svgStyle: String,
});

const svgSchema = mongoose.Schema({
  svgName: {
    // Image Name
    type: String,
    required: true,
  },
  svgPaths: [svgPath],
});

export default mongoose.model("SVG", svgSchema);
