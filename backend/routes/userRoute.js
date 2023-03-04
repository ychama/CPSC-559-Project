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
userRoute.put("/updateaccount", loggedIn, updateUser);
userRoute.get("/getuser/:userName", loggedIn, getUserInfo);
userRoute.get("/getuserworkspaces", loggedIn, getUserWorkspaces);
userRoute.delete("/deleteaccount", loggedIn, deleteUser);

export default userRoute;
