import { instance } from "../helpers/axiosHelper.js";
import { retry } from "../helpers/retry.js";

// BACKEND HELPER

// Template Helper to get all templates stored in the backend. These templates are used by users to start a coloring book.

// Function to get every single template from the backend
export const getAllTemplates = async () => {
  // Create the GET HTTP request using the imported axios instance, use the user authentication token stored in local storage to authorize the request
  // Also use the current backend URL stored in local storage to send a request to the currently connected server.
  let httpRequest = async () => {
    const response = await instance.get(
      localStorage.getItem("backendURL") + "/templates/",
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
    return response.data;
  };
  // Use the retry function to run the request several times, using a different backend URL each time (in case of failure)
  return retry(httpRequest);
};

// Function to get a single template (by its id) from the backend
export const getTemplate = async (id) => {
  // Create the HTTP GET request using the imported axios instance, use the user authentication token stored in local storage to authorize the request
  // Also use the current backend URL stored in local storage to send a request to the currently connected server.
  let httpRequest = async () => {
    const response = await instance.get(
      localStorage.getItem("backendURL") + "/templates/" + id,
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
    return response.data;
  };
  // Use the retry function to run the request several times, using a different backend URL each time (in case of failure)
  return retry(httpRequest);
};
