import axios from "axios";
import { instance } from "../helpers/axiosHelper.js";

export const getAllTemplates = async () => {
  let response = await instance.get(localStorage.getItem("backendURL") + "/templates/").then((response) => {
    return response.data;
  }).catch((err) => {
    return "error";
  });

  let fail_count = 1;
  while (response === "error" && fail_count < 3) {
    response = await instance.get(localStorage.getItem("backendURL") + "/templates/").then((response) => {
      return response.data;
    }).catch((err) => {
      return "error";
    });
    fail_count++;
  }
  return response
};

export const getTemplate = async (id) => {
  let response = await instance.get(localStorage.getItem("backendURL") + "/templates/" + id).then((response) => {
    return response.data;
  }).catch((err) => {
    return "error";
  });

  let fail_count = 1;
  while (response === "error" && fail_count < 3) {
    response = await instance.get(localStorage.getItem("backendURL") + "/templates/" + id).then((response) => {
      return response.data;
    }).catch((err) => {
      return "error";
    });
    fail_count++;
  }

  return response
};
