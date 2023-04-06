import express from "express";
import { getHealth } from "../controllers/healthController.js";

// Creating an express route to check the health of each server using the getHealth controller function
const healthRoute = express.Router();

healthRoute.get("/", getHealth);

export default healthRoute;
