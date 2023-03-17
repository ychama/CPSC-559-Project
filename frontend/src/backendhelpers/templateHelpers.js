import { instance } from "../helpers/axiosHelper.js";
import { retry } from "../helpers/retry.js";

export const getAllTemplates = async () => {
  let httpRequest = async () => {
    const response = await instance.get(localStorage.getItem("backendURL") + "/templates/");
    return response.data;
  };
  return retry(httpRequest);
};

export const getTemplate = async (id) => {
  let httpRequest = async () => {
    const response = await instance.get(localStorage.getItem("backendURL") + "/templates/" + id);
    return response.data;
  };
  return retry(httpRequest);
};
