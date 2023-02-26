import axios from "axios";

const endpointBase = "http://localhost:5001/api/svg/";

/*const customConfig = {
  withCredentials: true,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};*/

export const getSVG = async (id) => {
  return axios.get(endpointBase + "getSVG/" + id).then((response) => {
    return response.data;
  });
};

export const updateSVG = async (reqBody) => {
  return axios.put(endpointBase, reqBody).then((response) => {
    return response.data;
  });
};
