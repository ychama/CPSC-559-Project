import { instance } from "../helpers/axiosHelper.js";
import { retry } from "../helpers/retry.js";

export const getAllWorkspaces = async () => {
  let httpRequest = async () => {
    const response = await instance.get(localStorage.getItem("backendURL") + "/workspaces/");
    return response.data;
  };
  return retry(httpRequest);
};

export const createWorkspace = async (reqBody) => {
  let httpRequest = async () => {
    const response = await instance.post(localStorage.getItem("backendURL") + "/workspaces/", reqBody)
    return response.data;
  };
  return retry(httpRequest);
};
