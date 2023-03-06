import asyncHandler from "express-async-handler";
import Template from "../models/templateModel.js";

const getTemplate = asyncHandler(async (req, res) => {
  try {
    if (!req.params.templateName) {
      res.status(400);
      throw new Error("templateName not included in request body.");
    }
    const existingTemplate = await Template.findOne({ templateName: req.params.templateName });
    if (!existingTemplate) {
      res.status(400);
      throw new Error(
        "No Templates with the name " + req.params.templateName + " were found."
      );
    }
    res.status(200).json({ existingTemplate });
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

const getAllTemplates = asyncHandler(async (req, res) => {
  try {
    const existingTemplates = await Template.find({});
    res.status(200).json({ existingTemplates });
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

export { getTemplate, getAllTemplates };
