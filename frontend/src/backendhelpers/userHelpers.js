import { instance } from "../helpers/axiosHelper.js";
import { retry } from "../helpers/retry.js";

// BACKEND HELPER

// User Helper to provide all user information functionality in the system.
// All of these are helper functions that are used to sign users up, sign users in to the system, update user information, retrieve user information etc..

// Helper function to sign a user up
export const signUp = async (reqBody) => {
  // create HTTP POST request with user information stored in the request body
  // Also use the current backend URL stored in local storage to send a request to the currently connected server.
  let httpRequest = async () => {
    const response = await instance.post(
      localStorage.getItem("backendURL") + "/users/signup/",
      reqBody
    );
    return response.data;
  };
  // Use the retry function to run the request several times, using a different backend URL each time (in case of failure)
  return retry(httpRequest);
};

// Helper function to sign a user into their account
export const signIn = async (reqBody) => {
  // create HTTP POST request with username and password stored in the request body
  // Also use the current backend URL stored in local storage to send a request to the currently connected server.
  let httpRequest = async () => {
    const response = await instance.post(
      localStorage.getItem("backendURL") + "/users/login/",
      reqBody
    );
    return response.data;
  };
  // Use the retry function to run the request several times, using a different backend URL each time (in case of failure)
  return retry(httpRequest);
};

// Helper to retrieve a user's information from the backend
export const userInfo = async (userName) => {
  // Create the HTTP GET request, use the user authentication token stored in local storage to authorize the request
  // Also use the username in the request to get information for a specific user
  let httpRequest = async () => {
    const response = await instance.get(
      localStorage.getItem("backendURL") + "/users/" + userName,
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
    // Return all of the necessary user information for the requested user
    return {
      userEmail: response.data.userEmail,
      userFirstName: response.data.userFirstName,
      userLastName: response.data.userLastName,
      userName: response.data.userName,
    };
  };
  // Use the retry function to run the request several times, using a different backend URL each time (in case of failure)

  return retry(httpRequest);
};

// Helper to update a user's information in the backend
export const updateUser = async (userName, reqBody) => {
  // Create the HTTP PUT request, use the user authentication token stored in local storage to authorize the request
  // Also use the username in the request to update information for the specific user
  let httpRequest = async () => {
    const response = await instance
      .put(localStorage.getItem("backendURL") + "/users/" + userName, reqBody, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .catch((err) => {
        // return a specific error code if it is detected. This error code indicates that the username a user is trying to use is not valid, and they will be notified of this in the frontend
        if (err.response.status == 400 && err.response.data.code === 999)
          return { error: 999 };
      });
    // Check the response error code and return the response as a whole, or if successful return the response data
    if (response.error === 999) {
      return response;
    }
    if (response.status >= 200) return response.data.updatedUser;
  };
  // Use the retry function to run the request several times, using a different backend URL each time (in case of failure)
  return retry(httpRequest);
};

// Helper to delete a user's account
export const deleteUser = async (userName) => {
  // Create the HTTP DELETE request, use the user authentication token stored in local storage to authorize the request
  // Also use the username in the request to delete the specific user acccount
  let httpRequest = async () => {
    const response = await instance.delete(
      localStorage.getItem("backendURL") + "/users/" + userName,
      {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      }
    );
    return response;
  };
  // Use the retry function to run the request several times, using a different backend URL each time (in case of failure)
  return retry(httpRequest);
};
