import axios from "axios";

const endpointBase = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

export const getAllWorkspaces = async () => {
  let response = await instance.get(localStorage.getItem("backendURL") + "/workspaces/").then((response) => {
    return response.data;
  }).catch((err) => {
    return "error";
  });

  let fail_count = 1;
  while (response === "error" && fail_count < 3) {
    response = await instance.get(localStorage.getItem("backendURL") + "/workspaces/").then((response) => {
      return response.data;
    }).catch((err) => {
      return "error";
    });
    fail_count++;
  }

  return response
};

export const getWorkspace = async (code) => {
  let response = await instance.get(localStorage.getItem("backendURL") + "/workspaces/" + code).then((response) => {
    return response.data;
  }).catch((err) => {
    return "error";
  });

  let fail_count = 1;
  while (response === "error" && fail_count < 3) {
    response = await instance.get(localStorage.getItem("backendURL") + "/workspaces/" + code).then((response) => {
      return response.data;
    }).catch((err) => {
      return "error";
    });
    fail_count++;
  }

  return response
};

export const updateWorkspace = async (code, reqBody) => {
  let response = await instance.put(localStorage.getItem("backendURL") + "/workspaces/" + code, reqBody).then((response) => {
    return response.data;
  }).catch((err) => {
    return "error";
  });

  let fail_count = 1;
  while (response === "error" && fail_count < 3) {
    response = await instance.put(localStorage.getItem("backendURL") + "/workspaces/" + code, reqBody).then((response) => {
      return response.data;
    }).catch((err) => {
      return "error";
    });
    fail_count++;
  }

  return response
};

export const createWorkspace = async (reqBody) => {
  let response = await instance.post(localStorage.getItem("backendURL") + "/workspaces/", reqBody).then((response) => {
    return response.data;
  }).catch((err) => {
    return "error";
  });

  let fail_count = 1;
  while (response === "error" && fail_count < 3) {
    response = await instance.post(localStorage.getItem("backendURL") + "/workspaces/", reqBody).then((response) => {
      return response.data;
    }).catch((err) => {
      return "error";
    });
    fail_count++;
  }

  return response
};
