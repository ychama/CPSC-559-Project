import axios from "axios";

const endpointBase = "http://localhost:5001/api/svg/";

/*const customConfig = {
  withCredentials: true,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};*/

export const getSVG = async (svgName) => {
  return axios.get(endpointBase + "getSVG/" + svgName).then((response) => {
    return response.data;
  });
};
