import express from "express";
import loggedIn from "../middleware/userAuth.js";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
  getUserInfo,
  getUserWorkspaces,
} from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.post("/signup", createUser);
userRoute.post("/login", getUser);
userRoute.get("/:userName", getUserInfo);
userRoute.put("/:userName", updateUser);
userRoute.delete("/:userName", deleteUser);

export default userRoute;
