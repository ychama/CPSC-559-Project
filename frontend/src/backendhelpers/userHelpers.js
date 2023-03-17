import axios from "axios";
import { getBackendUrl } from "../backendhelpers/proxyHelper.js";
import * as rax from "retry-axios";

/*const customConfig = {
  withCredentials: true,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};*/
var backendURL = localStorage.getItem("backendURL");

const instance = axios.create({
  baseURL: backendURL,
  timeout: 5000,
});

instance.interceptors.response.use(
  (response) => {
    // If the request succeeds, return the response directly
    return response;
  },
  async (error) => {
    // If the request fails, try again with a new backend url
    const originalRequest = error.config;
    console.log(error);
    if (
      (error.response.status === 500 || error.response.status >= 400) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const newBackendUrlPromise = getBackendUrl();
      newBackendUrlPromise.then((newBackendUrl) => {
        originalRequest.baseURL = newBackendUrl;
        backendURL = newBackendUrl;
        localStorage.setItem("backendURL", newBackendUrl);
      });

      if (retries < 3) {
        retries += 1;
        originalRequest.retries = retries;
        return instance(originalRequest);
      }
      let retries = originalRequest.retries || 0;
    }
    // If the request still fails, return the error response
    return Promise.reject(error);
  }
);

export const signUp = async (reqBody) => {
  return instance.post("/users/signup/", reqBody).then((response) => {
    return response.data;
  });
};

export const signIn = async (reqBody) => {
  return instance.post("/users/login/", reqBody).then((response) => {
    return response.data;
  });
};
