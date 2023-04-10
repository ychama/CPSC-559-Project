import axios from "axios";

// BACKEND HELPER

// Proxy helper to request an available server URL from one of the proxies.
// This function is used in other backend requests.
// If a backend request fails, this function will retrieve the URL of a different backend for the user to connect to and make requests to.

// List of all proxy URL's in the system (this can be scaled up if necessary, and proxy processes can be duplicated in the docker-compose file)
const proxyList = [
  process.env.REACT_APP_PROXY_URL_1 || "http://localhost:4001/api",
  process.env.REACT_APP_PROXY_URL_2 || "http://localhost:4002/api",
  process.env.REACT_APP_PROXY_URL_3 || "http://localhost:4003/api",
  process.env.REACT_APP_PROXY_URL_4 || "http://localhost:4004/api",
];

// Function to get a new backend URL in case of failure
export const getBackendUrl = async () => {
  // Get the list of all available proxies
  let currentProxy, websocketURL, serverURL;
  let availableProxies = [...proxyList];

  // Loop through all of the available proxies, this will allow the user to connect to a different proxy in case of failure when requesting a backend URL
  while (availableProxies.length) {
    // Get the current proxy (selecting it randomly)
    currentProxy =
      availableProxies[Math.floor(Math.random() * availableProxies.length)];
    try {
      // attempt to request a new server URL from the current selected proxy process through HTTP
      const res = await axios.get(currentProxy + "/server").then((res) => {
        console.log(
          "Connected to proxy with URL: " + currentProxy + " successfully."
        );
        return res;
      });
      // If successful, assign the serverURL and websocketURL variables to the retrieved URL's
      serverURL = res.data.serverURL;
      websocketURL = res.data.websocketURL;
      // break from the while loop upon success
      break;
    } catch (err) {
      // Catch any errors and log the failed proxy connection
      console.log("Failed to connect to proxy at URL: " + currentProxy);
      // Remove the current proxy from the list of available proxies, and try a different proxy URL in the next iteration
      availableProxies = availableProxies.filter(
        (proxy) => proxy != currentProxy
      );
    }
  }
  // Verify that the websocketURL and serverURL's were retrieved successfully
  if (websocketURL && serverURL) {
    // return the URL's
    return {
      serverURL: serverURL,
      websocketURL: websocketURL,
    };
  } else {
    // If the URL's do not exist, we exhausted all possible proxy URLs and failed to retrieve a backend URL
    console.log("Failed to get serverURL/websocketURL from all proxies.");
  }
};

// Sets a new HTTP backend URL, used when a user navigates to a new page to ensure primary HTTP replica is being communicated with
export const setHTTPBackendURL = async () => {
  getBackendUrl()
    .then((urls) => {
      localStorage.setItem("backendURL", urls.serverURL);
      //localStorage.setItem("websocketURL", urls.websocketURL);
    })
    .catch((err) => {
      localStorage.setItem("backendURL", "http://localhost:5001/api");
      //localStorage.setItem("websocketURL", "ws://localhost:7001");
    });
};

// Sets a new Web Socket backend URL, used when a user navigates to the canvas page to ensure an active Web Socket server replica is being communicated with
export const setWSBackendURL = async () => {
  getBackendUrl()
    .then((urls) => {
      //localStorage.setItem("backendURL", urls.serverURL);
      localStorage.setItem("websocketURL", urls.websocketURL);
    })
    .catch((err) => {
      //localStorage.setItem("backendURL", "http://localhost:5001/api");
      localStorage.setItem("websocketURL", "ws://localhost:7001");
    });
};
