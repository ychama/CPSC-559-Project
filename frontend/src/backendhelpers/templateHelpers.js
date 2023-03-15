import axios from "axios";

const endpointBase = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

export const getAllTemplates = async () => {
  return axios.get(endpointBase + "/templates/", { headers: { "Authorization": localStorage.getItem('token') } }).then((response) => {
    return response.data;
  });
};

export const getTemplate = async (id) => {
  return axios.get(endpointBase + "/templates/" + id, { headers: { "Authorization": localStorage.getItem('token') } }).then((response) => {
    return response.data;
  });
};
