import express from "express";
import cors from "cors";
import axios from "axios";

const SERVER_CLIENT_BASE_URL = "http://localhost:500{}/api";
const SERVER_CLIENT_WEBSOCKET_URL = "ws://localhost:700{}";
const SERVER_HEALTH_URL = "http://backend{}:5000/api/health/";

let ALL_SERVERS = new Set([1, 2, 3, 4]);
let AVAILABLE_SERVERS = new Set([1, 2, 3, 4]);
let OFFLINE_SERVERS = new Set([]);

const healthCheck = async () => {
  ALL_SERVERS.forEach((serverID, index) => {
    let serverURL = SERVER_HEALTH_URL.replace(/{}/g, serverID);

    axios
      .get(serverURL)
      .then((res) => {
        console.log(
          "server ",
          serverID,
          " was successful with the following message ",
          res.data.message
        );

        OFFLINE_SERVERS.delete(serverID);
        AVAILABLE_SERVERS.add(serverID);
      })
      .catch((err) => {
        console.log("Server " + serverID + " is down");
        AVAILABLE_SERVERS.delete(serverID);
        OFFLINE_SERVERS.add(serverID);
      });
  });

  console.log("AVAILABLE_SERVERS", AVAILABLE_SERVERS);
  console.log("OFFLINE_SERVERS", OFFLINE_SERVERS);
};

const port = 4000;

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.route("/api/server").get((req, res) => {
  try {
    let TEMP_AVAILABLE_SERVERS = [...AVAILABLE_SERVERS];
    const randomServer = Math.floor(
      Math.random() * TEMP_AVAILABLE_SERVERS.length
    );

    let serverURL = SERVER_CLIENT_BASE_URL.replace(
      /{}/g,
      TEMP_AVAILABLE_SERVERS[randomServer]
    );

    let websocketURL = SERVER_CLIENT_WEBSOCKET_URL.replace(
      /{}/g,
      TEMP_AVAILABLE_SERVERS[randomServer]
    );

    res.status(200).json({ serverURL, websocketURL });
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

app.listen(port, () => {
  console.log("Server started on port " + port);

  setInterval(healthCheck, 5000);
});
