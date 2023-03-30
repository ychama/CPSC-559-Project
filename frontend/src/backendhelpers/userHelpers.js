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

export const userInfo = async (userName) => {
  let httpRequest = async () => {
    const response = await instance.get(
      localStorage.getItem("backendURL") + "/users/" + userName,
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
    return {
      userEmail: response.data.userEmail,
      userFirstName: response.data.userFirstName,
      userLastName: response.data.userLastName,
      userName: response.data.userName,
    };
  };
  return retry(httpRequest);
};

export const updateUser = async (userName, reqBody) => {
  let httpRequest = async () => {
    const response = await instance
      .put(localStorage.getItem("backendURL") + "/users/" + userName, reqBody, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .catch((err) => {
        if (err.response.status == 400 && err.response.data.code === 999)
          return { error: 999 };
      });

    if (response.error === 999) {
      return response;
    }
    if (response.status >= 200) return response.data.updatedUser;
    //console.log("Response: " + JSON.stringify(response));
  };
  return retry(httpRequest);
};

export const deleteUser = async (userName) => {
  let httpRequest = async () => {
    const response = await instance.delete(
      localStorage.getItem("backendURL") + "/users/" + userName,
      {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      }
    );
    return response;
    //console.log("Response: " + JSON.stringify(response));
  };
  return retry(httpRequest);
};
