import axios from "axios";
import { getBackendUrl } from "../backendhelpers/proxyHelper.js";
import * as rax from "retry-axios";
const endpointBase =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

/*const customConfig = {
  withCredentials: true,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};*/

export const signUp = async (reqBody) => {
  return axios
    .post(endpointBase + "/users/signup/", reqBody)
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      let backendURL = getBackendUrl();
      localStorage.setItem("backendURL", backendURL);
    });
};

export const signIn = async (reqBody) => {
  return axios
    .post(endpointBase + "/users/login/", reqBody)
    .then((response) => {
      return response.data;
    });
};
