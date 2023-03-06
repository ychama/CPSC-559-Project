import express from "express";
import { getTemplate, getAllTemplates } from "../controllers/templateController.js";

const templateRoute = express.Router();

templateRoute.get("/:templateName", getTemplate);
templateRoute.get("/", getAllTemplates);

export default templateRoute;
