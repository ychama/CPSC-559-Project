import express from "express";
import cors from "cors";
import axios from "axios";

// CPSC 559 Group Project

// PROXY LAYER/LOAD BALANCER

// This process is a simple node.js server that is responsible for routing clients (frontend processes) to available server processes and checking server health.

// This process is replicated as can be seen in the docker-compose.yml for the project.

setTimeout(() => {}, 3000);

// keep constant URL strings for checking health and directing users to available servers (using both HTTP and web socket "connections").
const SERVER_CLIENT_BASE_URL = "http://localhost:500{}/api";
const SERVER_CLIENT_WEBSOCKET_URL = "ws://localhost:700{}";
const SERVER_HEALTH_URL = "http://backend{}:5000/api/health/";

// Map all server IDs to the URLs exposed by ngrok
const SERVER_URLS = {
  '1': { 
    http: 'https://2d75348aa827.ngrok.app/api',
    ws: 'wss://4a58bf67a36e.ngrok.app',
  },
  '2': { 
    http: 'https://7975def44381.ngrok.app/api',
    ws: 'wss://9f9b3b5a0052.ngrok.app',
  },
  '3': { 
    http: 'https://82301c974abb.ngrok.app/api',
    ws: 'wss://4d8e49b5cb98.ngrok.app',
  },
  '4': { 
    http: 'https://7a7f7bbefd4e.ngrok.app/api',
    ws: 'wss://b75544472862.ngrok.app',
  },
}

// Keep a list of all servers, available servers (have not crashed) and offline servers (have crashed)
let ALL_SERVERS = new Set([1, 2, 3, 4]);
let AVAILABLE_SERVERS = new Set([1, 2, 3, 4]);
let OFFLINE_SERVERS = new Set([]);
let currentServer = AVAILABLE_SERVERS[0];

// Function to loop through all servers in the system and check their health at an endpoint.
// This also checks the database health as documented in the server endpoints (backend folder).
const healthCheck = async () => {
  // Loop through ALL servers
  ALL_SERVERS.forEach((serverID, index) => {
    // get server URL
    let serverURL = SERVER_HEALTH_URL.replace(/{}/g, serverID);
    // Send a request at the health endpoint and process the result
    axios
      .get(serverURL)
      .then((res) => {
        // If successful (server is healthy), delete the server from offline servers and add it to the set of available servers (users can connect to it)
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
        // If there is an error (timeout, connection refused, etc...), remove the server from the set of available servers and add it to the set of offline servers (users will not be directed to it)
        console.log("Server " + serverID + " is down");
        if (currentServer === serverID) {
          // If it is not available, change the current primary server
          // always picking the lowest available server id for new HTTP primary server
          let TEMP_AVAILABLE_SERVERS = [...AVAILABLE_SERVERS];
          TEMP_AVAILABLE_SERVERS.sort();
          currentServer = TEMP_AVAILABLE_SERVERS[0];
        }
        AVAILABLE_SERVERS.delete(serverID);
        OFFLINE_SERVERS.add(serverID);
      });
  });
  // Log available/offline servers
  console.log("AVAILABLE_SERVERS", AVAILABLE_SERVERS);
  console.log("OFFLINE_SERVERS", OFFLINE_SERVERS);
  console.log("CURRENT HTTP PRIMARY: ", currentServer);
};

const port = 4000;

// Setting up the server process with Express and CORS
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Creating an endpoint at the proxy process for clients to request server URL's
app.route("/api/server").get((req, res) => {
  try {
    // Attempt to retrieve a random server from the available servers
    let TEMP_AVAILABLE_SERVERS = [...AVAILABLE_SERVERS];
    const randomServer = Math.floor(
      Math.random() * TEMP_AVAILABLE_SERVERS.length
    );

    // Get the Web socket URL
    let websocketURL = SERVER_URLS[randomServer].ws;

    // Check that the current "Primary" HTTP server is still available
    if (!TEMP_AVAILABLE_SERVERS.includes(currentServer)) {
      // If it is not available, change the current primary server

      // always picking the lowest available server id for new HTTP primary server
      TEMP_AVAILABLE_SERVERS.sort();
      currentServer = TEMP_AVAILABLE_SERVERS[0];
    }
    
    // Get the HTTP URL
    let serverURL = SERVER_URLS[currentServer].http;

    // send successful response
    res.status(200).json({ serverURL, websocketURL });
  } catch (error) {
    // Return any error to the client, which will result in the client attempting to connect with a different load balancer
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});
// Start server and listen for requests
app.listen(port, () => {
  console.log("Server started on port " + port);
  setInterval(healthCheck, 5000);
});
