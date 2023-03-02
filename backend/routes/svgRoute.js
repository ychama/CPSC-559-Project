import express from "express";
import { getSVG, updateSVG } from "../controllers/svgController.js";

const svgRoute = express.Router();

svgRoute.get("/getSVG/:svgName", getSVG);
svgRoute.put("/", updateSVG);

export default svgRoute;
