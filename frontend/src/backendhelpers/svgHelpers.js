import axios from "axios";

const endpointBase = "http://localhost:5001/api/svg/";

/*const customConfig = {
  withCredentials: true,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};*/

export const getUser = async (userName) => {
  return axios.get(endpointBase + "getSVG/" + userName).then((response) => {
    return response.data;
  });
};
