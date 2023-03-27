import axios from "axios";
import { getBackendUrl } from "../backendhelpers/proxyHelper.js";

getBackendUrl().then((urls) => {
    localStorage.setItem("backendURL", urls.serverURL);
    localStorage.setItem("websocketURL", urls.websocketURL);
}).catch((err) => {
    localStorage.setItem("backendURL", "http://localhost:5001/api");
    localStorage.setItem("websocketURL", "ws://localhost:7001");
});

export const instance = axios.create({
    baseURL: '',
    timeout: 1000,
});

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