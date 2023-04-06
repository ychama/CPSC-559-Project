import asyncHandler from "express-async-handler";
import Template from "../models/templateModel.js";

// TEMPLATE CONTROLLER

// Controller function to get a specific template. Requests will be processed using this function.
const getTemplate = asyncHandler(async (req, res) => {
  try {
    // check if the template name is part of the request parameters, if it is not respond with an error (bad request)
    if (!req.params.templateName) {
      res.status(400);
      throw new Error("templateName not included in request body.");
    }
    // Find the template with the specified name, if it does not exist respond with an error
    const existingTemplate = await Template.findOne({
      templateName: req.params.templateName,
    });
    if (!existingTemplate) {
      res.status(400);
      throw new Error(
        "No Templates with the name " + req.params.templateName + " were found."
      );
    }
    // If it exists, return it
    res.status(200).json({ existingTemplate });
  } catch (error) {
    // Respond with any error messages
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

// Controller function to get all templates in the database.
const getAllTemplates = asyncHandler(async (req, res) => {
  try {
    // Get all templates in the database
    const existingTemplates = await Template.find({});
    // Return all templates in the database
    res.status(200).json({ existingTemplates });
  } catch (error) {
    // Respond with any errors that may occur.
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

export { getTemplate, getAllTemplates };
