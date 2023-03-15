import axios from "axios";

const endpointBase = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

export const getAllWorkspaces = async () => {
  return axios.get(endpointBase + "/workspaces/", { headers: { "Authorization": localStorage.getItem('token') } }).then((response) => {
    return response.data;
  });
};

export const getWorkspace = async (code) => {
  return axios.get(endpointBase + "/workspaces/" + code, { headers: { "Authorization": localStorage.getItem('token') } }).then((response) => {
    return response.data;
  });
};

export const updateWorkspace = async (code, reqBody) => {
  return axios
    .put(endpointBase + "/workspaces/" + code, reqBody, { headers: { "Authorization": localStorage.getItem('token') } })
    .then((response) => {
      return response.data;
    });
};

export const createWorkspace = async (reqBody) => {
  return axios.post(endpointBase + "/workspaces/", reqBody, { headers: { "Authorization": localStorage.getItem('token') } }).then((response) => {
    return response.data;
  });
};
