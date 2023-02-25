import express from "express";
import { getSVG } from "../controllers/svgController.js";

const svgRoute = express.Router();

//reviewRoute.post("/", loggedIn, createCourse);
svgRoute.get("/getSVG/:svgName", getSVG);
//courseRoute.get("/getspecificcourse/:id", getSpecificCourse);
//reviewRoute.put("/:id", loggedIn, updateCourse);
//reviewRoute.delete("/:id", loggedIn, deleteCourse);

export default svgRoute;
