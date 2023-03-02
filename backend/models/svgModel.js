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
    type: String,
    required: true,
  },
  svgGroupTransform: String,
  svgPaths: [svgPath],
});

export default mongoose.model("SVG", svgSchema);
