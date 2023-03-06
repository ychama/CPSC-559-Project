import express from "express";
import { getTemplate, getAllTemplates } from "../controllers/templateController.js";

const templateRoute = express.Router();

templateRoute.get("/:svgName", getTemplate);
templateRoute.get("/", getAllTemplates);

export default templateRoute;
