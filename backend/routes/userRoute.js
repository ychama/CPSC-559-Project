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
userRoute.put("/updateaccount", updateUser);
userRoute.get("/getuser/:userName", getUserInfo);
userRoute.get("/getuserworkspaces", getUserWorkspaces);
userRoute.delete("/deleteaccount", deleteUser);

export default userRoute;
