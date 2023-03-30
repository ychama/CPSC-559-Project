import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Workspace from "../models/workspaceModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
  postBroadCast,
  putBroadCast,
  deleteBroadCast,
} from "../middleware/httpBroadcast.js";

dotenv.config();

const { SECRET = "secret" } = process.env;

const createUser = asyncHandler(async (req, res) => {
  try {
    const userNameExists = await User.exists({ userName: req.body.userName });
    const userEmailExists = await User.exists({
      userEmail: req.body.userEmail,
    });
    if (userEmailExists || userNameExists) {
      res.status(400).json({
        error:
          "An account with the username " +
          req.body.userName +
          " or email " +
          req.body.userEmail +
          " already exists!",
      });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.userPassword, 10);

      const newUser = await User.create({
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userPassword: hashedPassword,
        userFirstName: req.body.userFirstName,
        userLastName: req.body.userLastName,
      });

      const token = jwt.sign({ userName: newUser.userName }, SECRET);
      const cookieSettings = {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: false,
        sameSite: "lax",
      };
      res.cookie("userAuth", token, cookieSettings);
      res.cookie("userName", req.body.userName, cookieSettings);
      res.status(200).json(token);
    }
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json({ error: errMessage });
  }
  if (!req.body.isBroadcast) postBroadCast("/users/signup/", req.body, "");
});

// not tested
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const existingUser = await User.findOne({
      userName: req.params.userName,
    });
    if (!existingUser) {
      res.status(400);
      throw new Error("User " + req.params.userName + " not found.");
    }
    //await Workspace.deleteMany({
    // workspaceOwner: existingUser.userName,
    //});
    await existingUser.remove();
    res.status(200).json({
      message: "Removed user account with username: " + req.params.userName,
    });
    if (!req.headers.isBroadcast) {
      console.log(
        "\n\nHERE IS THE REQ HEADERS: " + JSON.stringify(req.headers)
      );
      deleteBroadCast(`/users/${req.params.userName}/`, req.headers);
    }
  } catch (error) {
    console.log(error);
    const errMessage = error.message;
    res.status(400).json({ error: errMessage });
  }
});

// Getting user JSWT for authentication to requests
const getUser = asyncHandler(async (req, res) => {
  try {
    if (!req.body.userName || !req.body.userPassword) {
      res.status(400);
      throw new Error("userName or userPassword not included in request body.");
    }
    const user = await User.findOne({
      userName: req.body.userName,
    });
    if (!user) {
      res
        .status(402)
        .json({ error: "User " + req.body.userName + " not found." });
    } else {
      const comparison = await bcrypt.compare(
        req.body.userPassword,
        user.userPassword
      );
      if (comparison) {
        const token = await jwt.sign({ userName: user.userName }, SECRET);
        const cookieSettings = {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          secure: true,
          httpOnly: false,
          sameSite: "lax",
        };
        res.cookie("userAuth", token, cookieSettings);
        res.cookie("userName", req.body.userName, cookieSettings);
        res.status(200).json(token);
      } else {
        res
          .status(405)
          .json({ error: "Password does not match existing password." });
      }
    }
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json({ error: errMessage });
  }
});

// not tested
const updateUser = asyncHandler(async (req, res) => {
  try {
    let userNameExists = false;
    let userEmailExists = false;
    if (req.body.userName) {
      userNameExists = await User.exists({ userName: req.body.userName });
    }
    if (req.body.userEmail) {
      userEmailExists = await User.exists({
        userEmail: req.body.userEmail,
      });
    }

    if (userEmailExists || userNameExists) {
      res.status(400).json({
        code: 999,
        error:
          "An account with the username " +
          req.body.userName +
          " or email " +
          req.body.userEmail +
          " already exists!",
      });
    } else {
      const user = await User.findOne({ userName: req.params.userName });
      const userName = user.userName;
      if (!user) {
        res.status(400);
        throw new Error("User " + req.params.userName + " not found.");
      }

      if (req.body.userPassword) {
        const hashedPassword = await bcrypt.hash(req.body.userPassword, 10);
        req.body.userPassword = hashedPassword;
      }
      const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
        new: true,
      });

      const response = Workspace.updateMany(
        { workspaceOwner: userName },
        { $set: { workspaceOwner: updatedUser.userName } }
      );
      console.log(response);
      res.status(200).json({ updatedUser });
    }
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json({ error: errMessage });
  }
  if (!req.body.isBroadcast) putBroadCast(`/users/${req.params.userName}/`, req.body, req.headers.authorization.split(" ")[1]);
});

const getUserInfo = asyncHandler(async (req, res) => {
  try {
    const existingUser = await User.find({
      userName: req.params.userName,
    });
    if (!existingUser) {
      res.status(400);
      throw new Error('User "' + req.params.userName + '" not found.');
    }
    const userInfo = existingUser[0];
    res.status(200).json({
      userName: userInfo.userName,
      userEmail: userInfo.userEmail,
      userFirstName: userInfo.userFirstName,
      userLastName: userInfo.userLastName,
    });
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

export { createUser, deleteUser, getUser, updateUser, getUserInfo };
