import axios from "axios";

const endpointBase = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

export const getAllWorkspaces = async () => {
  return axios.get(endpointBase + "/workspaces/").then((response) => {
    return response.data;
  });
};

export const createWorkspace = async (reqBody) => {
  return axios.post(endpointBase + "/workspaces/", reqBody).then((response) => {
    return response.data;
  });
};
