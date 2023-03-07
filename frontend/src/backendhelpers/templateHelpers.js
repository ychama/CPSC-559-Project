import axios from "axios";

const endpointBase = process.env.BACKEND_URL || "http://localhost:5000/api";

/*const customConfig = {
  withCredentials: true,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};*/

export const getAllTemplates = async () => {
  return axios.get(endpointBase + "/templates/").then((response) => {
    return response.data;
  });
};

export const getTemplate = async (id) => {
  return axios.get(endpointBase + "/templates/" + id).then((response) => {
    return response.data;
  });
};
