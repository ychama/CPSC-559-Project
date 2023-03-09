import axios from "axios";

const endpointBase = process.env.BACKEND_URL || "http://localhost:5000/api";

export const getAllWorkspaces = async () => {
  return axios.get(endpointBase + "/workspaces/").then((response) => {
    return response.data;
  });
};

export const getWorkspace = async (code) => {
  return axios.get(endpointBase + "/workspaces/" + code).then((response) => {
    return response.data;
  });
};

export const updateWorkspace = async (code, reqBody) => {
  return axios
    .put(endpointBase + "/workspaces/" + code, reqBody)
    .then((response) => {
      return response.data;
    });
};

export const createWorkspace = async (reqBody) => {
  return axios.post(endpointBase + "/workspaces/", reqBody).then((response) => {
    return response.data;
  });
};
