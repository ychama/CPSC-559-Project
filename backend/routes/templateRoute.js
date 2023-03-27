import express from "express";
import { getTemplate, getAllTemplates } from "../controllers/templateController.js";
import loggedIn from "../middleware/userAuth.js";

const templateRoute = express.Router();

templateRoute.get("/:templateName", loggedIn, getTemplate);
templateRoute.get("/", loggedIn, getAllTemplates);

export default templateRoute;
