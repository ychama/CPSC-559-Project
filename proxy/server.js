import express from "express";
import cors from "cors";
import axios from "axios";

import serverRoute from "./routes/serverRoute.js";

const SERVER_BASE_URL = "http://localhost:500{}/api";
let AVAILABLE_SERVERS = new Set([2, 3, 4]);
let OFFLINE_SERVERS = new Set([]);

const healthCheck = async () => {
  AVAILABLE_SERVERS.forEach((serverID, index) => {
    let serverURL = SERVER_BASE_URL.replace("{}", serverID);

    console.log("AVAILABLE_SERVERS", AVAILABLE_SERVERS);
    console.log("OFFLINE_SERVERS", OFFLINE_SERVERS);
    axios
      .get(serverURL + "/health/")
      .then((res) => {
        console.log(
          "server ",
          serverID,
          " was succesful with the following message ",
          res.data.message
        );
      })
      .catch((err) => {
        console.log("An error has occured, server ", serverID);

        OFFLINE_SERVERS.add(serverID);
      });
  });

  AVAILABLE_SERVERS = new Set(
    [...AVAILABLE_SERVERS].filter((x) => !OFFLINE_SERVERS.has(x))
  );
};

const port = 4000;

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use("/api/server", serverRoute);

app.route("/api/server").get((req, res) => {
  try {
    let TEMP_AVAILABLE_SERVERS = [...AVAILABLE_SERVERS];
    const randomServer = Math.floor(
      Math.random() * TEMP_AVAILABLE_SERVERS.length
    );

    let serverURL = SERVER_BASE_URL.replace(
      "{}",
      TEMP_AVAILABLE_SERVERS[randomServer]
    );

    res.status(200).json({ serverURL });
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

app.listen(port, () => {
  console.log("Server started on port " + port);

  setInterval(healthCheck, 5000);
});
