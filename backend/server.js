import express from "express";
import connectMongoDB from "./config/db.js";
import cors from "cors";
import asyncHandler from "express-async-handler";

import userRoute from "./routes/userRoute.js";
import workspaceRoute from "./routes/workspaceRoute.js";
import templateRoute from "./routes/templateRoute.js";
import healthRoute from "./routes/healthRoute.js";
import { startFrontendSocket } from "./communication/ToFrontendSocket.js";
import {
  listenForServers,
  connectToOtherServers,
} from "./communication/ServerToServerSocket.js";
// Connect to MongoDB instance using config function
connectMongoDB();

const port = process.env.PORT || 5000;
// Create HTTP server
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add endpoints to the server using the routes
app.use("/api/workspaces", workspaceRoute);
app.use("/api/users", userRoute);
app.use("/api/templates", templateRoute);
app.use("/api/health", healthRoute);

// Unused
app.get(
  "/api/getUserCookie",
  asyncHandler(async (req, res) => {
    res.send({
      userAuth: req.cookies.userAuth,
      userName: req.cookies.userName,
    });
  })
);

// Unused
app.get(
  "/api/deleteUserCookie",
  asyncHandler(async (req, res) => {
    res.clearCookie("userAuth");
    res.clearCookie("userName");
    res.send("Cookies have been deleted.");
  })
);

// Web socket communication
listenForServers();
connectToOtherServers();
startFrontendSocket();

// Start the server and listen for requests.
app.listen(port, () => console.log("Server started on port " + port));
