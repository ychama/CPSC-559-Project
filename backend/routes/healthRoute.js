import express from "express";
import { getHealth } from "../controllers/healthController.js";

const healthRoute = express.Router();

healthRoute.get("/", getHealth);

export default healthRoute;
