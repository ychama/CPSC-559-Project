import axios from "axios";

const endpointBase = process.env.REACT_APP_PROXY_URL || "http://localhost:5000/api";

/*const customConfig = {
  withCredentials: true,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};*/

export const getAllTemplates = async () => {
  let backendURL = localStorage.getItem("backendURL");
  return axios.get(backendURL + "/templates/").then((response) => {
    return response.data;
  });
};

export const getTemplate = async (id) => {
  let backendURL = localStorage.getItem("backendURL");
  return axios.get(backendURL + "/templates/" + id).then((response) => {
    return response.data;
  });
};
