import axios from "axios";

const endpointBase = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

export const getAllWorkspaces = async () => {
  let backendURL = localStorage.getItem("backendURL");
  return axios.get(backendURL + "/workspaces/").then((response) => {
    return response.data;
  });
};

export const getWorkspace = async (code) => {
  let backendURL = localStorage.getItem("backendURL");
  return axios.get(backendURL + "/workspaces/" + code).then((response) => {
    return response.data;
  });
};

export const updateWorkspace = async (code, reqBody) => {
  let backendURL = localStorage.getItem("backendURL");
  return axios
    .put(backendURL + "/workspaces/" + code, reqBody)
    .then((response) => {
      return response.data;
    });
};

export const createWorkspace = async (reqBody) => {
  let backendURL = localStorage.getItem("backendURL");
  return axios.post(backendURL + "/workspaces/", reqBody).then((response) => {
    return response.data;
  });
};
