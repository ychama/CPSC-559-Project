import express from "express";
import {
  getTemplate,
  getAllTemplates,
} from "../controllers/templateController.js";
import loggedIn from "../middleware/userAuth.js";

// Creating an express route for the template endpoints using the controller functions and logged in middleware
// These functions will only be triggered at the endpoint when a requestor's JSON Web Token is authorized successfully
const templateRoute = express.Router();

// Requires templateName as a parameter
templateRoute.get("/:templateName", loggedIn, getTemplate);
templateRoute.get("/", loggedIn, getAllTemplates);

export default templateRoute;
