import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import workspaceRoute from "./routes/workspaceRoute.js";
import svgRoute from "./routes/svgRoute.js";
import cors from "cors";
import http from "http";
import workspaceModel from "./models/workspaceModel.js";
import WebSocket from "ws";
import asyncHandler from "express-async-handler";
dotenv.config({ path: ".env" });

connectMongoDB();

const port = process.env.PORT || 5000;

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/workspaces", userRoute);
app.use("/api/users", workspaceRoute);
app.use("/api/svg", svgRoute);

app.get(
  "/api/getUserCookie",
  asyncHandler(async (req, res) => {
    res.send({
      userAuth: req.cookies.userAuth,
      userName: req.cookies.userName,
    });
  })
);

app.get(
  "/api/deleteUserCookie",
  asyncHandler(async (req, res) => {
    res.clearCookie("userAuth");
    res.clearCookie("userName");
    res.send("Cookies have been deleted.");
  })
);

// const wss = new WebSocket.Server({ noServer: true });

// wss.on("connection", (ws) => {
//   console.log("A new client has connected!");

//   ws.on("message", (message) => {
//     console.log(`Received message: ${message}`);
//     const jsonMsg = JSON.parse(message);
//     // Updating depends on how we send the JSON, we will find the workspace and update the paths
//     workspaceModel.findOneAndUpdate({}, {}, {}, (err, workspace) => {
//       if (err) {
//         console.log("Something went wrong updating the workspace.");
//       } else {
//         console.log("The workspace was successfully updated.");
//         // Send to clients if the backend is successfully updated, we can change this if need be
//         wss.clients.forEach((client) => {
//           // Will need to make sure clients can process other client updates (on open sockets)
//           if (client !== ws && client.readyState === WebSocket.OPEN) {
//             client.send(message);
//           }
//         });
//       }
//     });
//   });
// });

// server.on("upgrade", (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, (socket) => {
//     wss.emit("connection", socket, request);
//   });
// });

app.listen(port, () => console.log("Server started on port " + port));
