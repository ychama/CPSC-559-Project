import { instance } from "../helpers/axiosHelper.js";
import { retry } from "../helpers/retry.js";
// WORKSPACE HELPER

// Workspace Helpers to provide all user workspace information in the system.
// All of these are helper functions that are used to get all workspaces, create a workspace, get a specific workspace, update a workspace, etc...
// These allow users to interact with the canvases

// Helper function to get all workspaces stored in the database.
export const getAllWorkspaces = async () => {
  // create HTTP GET request, use the user authentication token stored in local storage to authorize the request
  // Also use the current backend URL stored in local storage to send a request to the currently connected server.
  let httpRequest = async () => {
    const response = await instance.get(
      localStorage.getItem("backendURL") + "/workspaces/",
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
    return response.data;
  };
  // Use the retry function to run the request several times, using a different backend URL each time (in case of failure)
  return retry(httpRequest);
};

// Helper function to get a specific workspace stored in the database.
export const getWorkspace = async (code) => {
  // Create HTTP GET Request using the workspace code in the request URL, use the user authentication token stored in local storage to authorize the request
  // Also use the current backend URL stored in local storage to send a request to the currently connected server.
  let httpRequest = async () => {
    const response = await instance.get(
      localStorage.getItem("backendURL") + "/workspaces/" + code,
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
    return response.data;
  };
  // Use the retry function to run the request several times, using a different backend URL each time (in case of failure)
  return retry(httpRequest);
};

// Helper function to update a specific workspace stored in the database.
export const updateWorkspace = async (code, reqBody) => {
  // Create HTTP PUT Request using the workspace code in the request URL, use the user authentication token stored in local storage to authorize the request
  // Also use the request body argument containing the updates of the workspace
  // Also use the current backend URL stored in local storage to send a request to the currently connected server.
  let httpRequest = async () => {
    const response = await instance.put(
      localStorage.getItem("backendURL") + "/workspaces/" + code,
      reqBody,
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
    return response.data;
  };
  // Use the retry function to run the request several times, using a different backend URL each time (in case of failure)
  return retry(httpRequest);
};

// Helper function to create a new workspace and store it in the database
export const createWorkspace = async (reqBody) => {
  // Create HTTP POST Request using the workspace code in the request URL, use the user authentication token stored in local storage to authorize the request
  // Include the request body argument in the request to create the workspace with the provided information
  let httpRequest = async () => {
    const response = await instance.post(
      localStorage.getItem("backendURL") + "/workspaces/",
      reqBody,
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
    return response.data;
  };
  // Use the retry function to run the request several times, using a different backend URL each time (in case of failure)
  return retry(httpRequest);
};
