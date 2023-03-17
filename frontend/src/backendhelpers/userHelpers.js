import { instance } from "../helpers/axiosHelper.js";

export const signUp = async (reqBody) => {
  let response = await instance.post(localStorage.getItem("backendURL") + "/users/signup/", reqBody).then((response) => {
    return response.data;
  }).catch((err) => {
    console.log(err)
    return "error";
  });

  let fail_count = 1;
  while (response === "error" && fail_count < 3) {
    response = await instance.post(localStorage.getItem("backendURL") + "/users/signup/", reqBody).then((response) => {
      return response.data;
    }).catch((err) => {
      return "error";
    });
    fail_count++;
  }

  return response;
};

export const signIn = async (reqBody) => {
  let response = await instance.post(localStorage.getItem("backendURL") + "/users/login/", reqBody).then((response) => {
    return response.data;
  }).catch((err) => {
    return "error";
  });

  let fail_count = 1;
  while (response === "error" && fail_count < 3) {
    response = await instance.post(localStorage.getItem("backendURL") + "/users/login/", reqBody).then((response) => {
      return response.data;
    }).catch((err) => {
      return "error";
    });
    fail_count++;
  }

  return response
};
