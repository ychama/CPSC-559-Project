import asyncHandler from "express-async-handler";
import SVG from "../models/svgModel.js";
import mongoose from "mongoose";

const getSVG = asyncHandler(async (req, res) => {
  try {
    if (!req.params.svgName) {
      res.status(400);
      throw new Error("svgName not included in request body.");
    }
    const existingSVG = await SVG.findOne({ svgName: req.params.svgName });
    if (!existingSVG) {
      res.status(400);
      throw new Error(
        "No SVG's with the name " + req.params.svgName + " were found."
      );
    }
    res.status(200).json({ existingSVG });
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

const updateSVG = asyncHandler(async (req, res) => {
  try {
    if (!req.body.svgName) {
      res.status(400);
      throw new Error("svgName not included in request body.");
    }
    if (!req.body.svgPaths) {
      res.status(400);
      throw new Error("svgPaths not included in request body.");
    }
    const query = { svgName: req.body.svgName };
    const update = { svgPaths: req.body.svgPaths };

    SVG.findOneAndUpdate(query, update, { new: true }, (err, doc) => {
      if (err) {
        res.status(400);
        throw new Error("Error updating SVG.");
      }
      res.status(200).json({ doc });
    });
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

export { getSVG, updateSVG };
