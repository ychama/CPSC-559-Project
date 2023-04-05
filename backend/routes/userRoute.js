import express from "express";
import loggedIn from "../middleware/userAuth.js";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
  getUserInfo,
} from "../controllers/userController.js";

// Creating an express route for the user endpoints using the controller functions and logged in middleware for certain functions
// The functions that include the logged in middleware will only be triggered at the endpoint when a requestor's JSON Web Token is authorized successfully
const userRoute = express.Router();

userRoute.post("/signup", createUser);
userRoute.post("/login", getUser);
// These three functions require userName as a parameter as well
userRoute.get("/:userName", loggedIn, getUserInfo);
userRoute.put("/:userName", loggedIn, updateUser);
userRoute.delete("/:userName", loggedIn, deleteUser);

export default userRoute;
