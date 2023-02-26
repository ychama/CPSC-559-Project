import express from "express";
import { getSVG, updateSVG } from "../controllers/svgController.js";

const svgRoute = express.Router();

//reviewRoute.post("/", loggedIn, createCourse);
svgRoute.get("/getSVG/:svgName", getSVG);
//courseRoute.get("/getspecificcourse/:id", getSpecificCourse);
svgRoute.put("/", updateSVG);
//reviewRoute.delete("/:id", loggedIn, deleteCourse);

export default svgRoute;
