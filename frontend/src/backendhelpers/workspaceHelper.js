import axios from "axios";

const endpointBase = process.env.BACKEND_URL || "http://localhost:5000/api";

export const getWorkspace = async (token) => {
  const headers = {
    Authorization: "bearer " + token,
  };

  return axios
    .get(endpointBase + "/workspaces/getAllWorkspaces/", { headers: headers })
    .then((response) => {
      return response.data;
    });
};
