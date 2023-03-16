import express from "express";


import {
    getServer
  } from "../controllers/serverController.js";


const serverRoute = express.Router();

serverRoute.get("/", getServer);



export default serverRoute;