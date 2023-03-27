import { instance } from "../helpers/axiosHelper.js";
import { retry } from "../helpers/retry.js";

export const getAllWorkspaces = async () => {
  let httpRequest = async () => {
    const response = await instance.get(localStorage.getItem("backendURL") + "/workspaces/", { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } });
    return response.data;
  };
  return retry(httpRequest);
};

export const getWorkspace = async (code) => {
  let httpRequest = async () => {
    const response = await instance.get(localStorage.getItem("backendURL") + "/workspaces/" + code, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } });
    return response.data;
  };
  return retry(httpRequest);
};

export const updateWorkspace = async (code, reqBody) => {
  let httpRequest = async () => {
    const response = await instance.put(localStorage.getItem("backendURL") + "/workspaces/" + code, reqBody, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } });
    return response.data;
  };
  return retry(httpRequest);
};

export const createWorkspace = async (reqBody) => {
  let httpRequest = async () => {
    const response = await instance.post(localStorage.getItem("backendURL") + "/workspaces/", reqBody, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } })
    return response.data;
  };
  return retry(httpRequest);
};
