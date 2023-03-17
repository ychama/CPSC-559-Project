import axios from "axios";
import { getBackendUrl } from "../backendhelpers/proxyHelper.js";

localStorage.setItem("backendURL", "http://localhost:5001/api")

export const instance = axios.create({
    baseURL: '',
    timeout: 1000,
});

instance.interceptors.response.use(
    (response) => {
        // If the request succeeds, return the response directly
        return response;
    },
    async (error) => {
        // If the request fails, find a new backend url
        console.log(error);
        getBackendUrl().then((newBackendUrl) => {
            localStorage.setItem("backendURL", newBackendUrl);
        });
        return Promise.reject(error);
    }
);