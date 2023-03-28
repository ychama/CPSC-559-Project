import { instance } from "../helpers/axiosHelper.js";
import { retry } from "../helpers/retry.js";

export const signUp = async (reqBody) => {
  let httpRequest = async () => {
    const response = await instance.post(
      localStorage.getItem("backendURL") + "/users/signup/",
      reqBody
    );
    return response.data;
  };
  return retry(httpRequest);
};

export const signIn = async (reqBody) => {
  let httpRequest = async () => {
    const response = await instance.post(
      localStorage.getItem("backendURL") + "/users/login/",
      reqBody
    );
    return response.data;
  };
  return retry(httpRequest);
};

export const userInfo = async (reqBody, userName) => {
  let httpRequest = async () => {
    const response = await instance.get(
      localStorage.getItem("backendURL") + "/users/" + userName,
      reqBody,
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
    return response.data;
  };
  return retry(httpRequest);
};
