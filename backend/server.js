import express from "express";
import connectMongoDB from "./config/db.js";
import cors from "cors";
import asyncHandler from "express-async-handler";

import userRoute from "./routes/userRoute.js";
import workspaceRoute from "./routes/workspaceRoute.js";
import templateRoute from "./routes/templateRoute.js";
import startClientWebSocket from "./communication/clientSocket.js";

connectMongoDB();

const port = process.env.PORT || 5000;

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/workspaces", workspaceRoute);
app.use("/api/users", userRoute);
app.use("/api/templates", templateRoute);

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

startClientWebSocket();

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
