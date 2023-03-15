import express from "express";
import loggedIn from "../middleware/userAuth.js";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
  getUserInfo,
} from "../controllers/userController.js";

const userRoute = express.Router();

userRoute.post("/signup", createUser);
userRoute.post("/login", getUser);
userRoute.get("/:userName", loggedIn, getUserInfo);
userRoute.put("/:userName", loggedIn, updateUser);
userRoute.delete("/:userName", loggedIn, deleteUser);

export default userRoute;
