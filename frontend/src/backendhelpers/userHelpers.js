import axios from "axios";

const endpointBase = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

export const signUp = async (reqBody) => {
  return axios
    .post(endpointBase + "/users/signup/", reqBody)
    .then((response) => {
      return response.data;
    });
};

export const signIn = async (reqBody) => {
  return axios
    .post(endpointBase + "/users/login/", reqBody)
    .then((response) => {
      return response.data;
    });
};
