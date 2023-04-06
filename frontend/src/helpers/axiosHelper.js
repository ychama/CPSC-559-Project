import axios from "axios";
import { getBackendUrl } from "../backendhelpers/proxyHelper.js";
// Axios Helper Instance used for retry and requesting new backend URLs

getBackendUrl()
  .then((urls) => {
    localStorage.setItem("backendURL", urls.serverURL);
    localStorage.setItem("websocketURL", urls.websocketURL);
  })
  .catch((err) => {
    localStorage.setItem("backendURL", "http://localhost:5001/api");
    localStorage.setItem("websocketURL", "ws://localhost:7001");
  });

// Creating new Axios Instance
export const instance = axios.create({
  baseURL: "",
  timeout: 1000,
});

// Using the getBackendURL helper to find new server URL in case a previously sent request failed to another server.
// This is used with retry to ensure new backend URL's are retrieved in case of failure.
instance.interceptors.response.use(
  (response) => {
    // If the request succeeds, return the response directly
    return response;
  },
  (error) => {
    // If the request fails, find a new backend urls
    getBackendUrl().then((urls) => {
      localStorage.setItem("backendURL", urls.serverURL);
      localStorage.setItem("websocketURL", urls.websocketURL);
    });
    return Promise.reject(error);
  }
);
