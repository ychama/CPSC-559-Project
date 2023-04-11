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

import {
  getServerHttpUpdates,
  setServerHttpUpdates,
} from "../communication/WorkspaceSocketTOB.js";

const { SECRET = "secret" } = process.env;

// USER CONTROLLER

// Controller function to create a new user document. User sign up requests will be processed using this function.
const createUser = asyncHandler(async (req, res) => {
  try {
    // Check if the username or email exist in the database
    const userNameExists = await User.exists({ userName: req.body.userName });
    const userEmailExists = await User.exists({
      userEmail: req.body.userEmail,
    });
    // If they do, return a descriptive error
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
      // If they do not, hash the user password using bcrypt
      const hashedPassword = await bcrypt.hash(req.body.userPassword, 10);
      // Create a new user to be stored in the database with the encrypted password and request body details
      const newUser = await User.create({
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userPassword: hashedPassword,
        userFirstName: req.body.userFirstName,
        userLastName: req.body.userLastName,
      });

      let update = {
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userPassword: hashedPassword,
        userFirstName: req.body.userFirstName,
        userLastName: req.body.userLastName,
        type: "createUser",
      };

      let serverHttpUpdates = getServerHttpUpdates();

      for (const [key, value] of Object.entries(serverHttpUpdates)) {
        let tempUpdates = [...value];

        tempUpdates.push(update);

        serverHttpUpdates[key] = tempUpdates;
      }

      setServerHttpUpdates(serverHttpUpdates);

      // After successful creation of the user document, get a JSON Web Token for the created user for authentication
      const token = jwt.sign({ userName: newUser.userName }, SECRET);
      // Persistent cookie settings
      const cookieSettings = {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: false,
        sameSite: "lax",
      };
      res.cookie("userAuth", token, cookieSettings);
      res.cookie("userName", req.body.userName, cookieSettings);
      // Respond with the JWT and success code
      res.status(200).json(token);
    }
  } catch (error) {
    // Catch and return any errors
    const errMessage = error.message;
    res.status(400).json({ error: errMessage });
  }
  // Check if this request was broadcasted by other servers, if it was not (it was a client request) then broadcast it to other servers using broadcast helper
  if (!req.body.isBroadcast) postBroadCast("/users/signup/", req.body, "");
});

// Controller function to delete a user document from the database
const deleteUser = asyncHandler(async (req, res) => {
  try {
    // Find the existing user
    const existingUser = await User.findOne({
      userName: req.params.userName,
    });
    // Return an error if it does not exist
    if (!existingUser) {
      res.status(400);
      throw new Error("User " + req.params.userName + " not found.");
    }
    // If it exists, remove it and return a success message
    await existingUser.remove();

    let update = {
      userName: req.params.userName,
      type: "deleteUser",
    };

    let serverHttpUpdates = getServerHttpUpdates();

    for (const [key, value] of Object.entries(serverHttpUpdates)) {
      let tempUpdates = [...value];

      tempUpdates.push(update);

      serverHttpUpdates[key] = tempUpdates;
    }

    setServerHttpUpdates(serverHttpUpdates);

    res.status(200).json({
      message: "Removed user account with username: " + req.params.userName,
    });
    // Check if this request was broadcasted by other servers, if it was not (it was a client request) then broadcast it to other servers using broadcast helper
    if (!req.headers.isBroadcast) {
      console.log(
        "\n\nHERE IS THE REQ HEADERS: " +
          JSON.stringify(req.headers.authorization)
      );

      deleteBroadCast(
        `/users/${req.params.userName}/`,
        {},
        req.headers.authorization.split(" ")[1]
      );
    }
  } catch (error) {
    // Catch and log any errors
    console.log(error);
    const errMessage = error.message;
    res.status(400).json({ error: errMessage });
  }
});

// Controller function to log a user in by retrieving a JWT for that user. User log in requests will be processed using this function.
const getUser = asyncHandler(async (req, res) => {
  try {
    // Check that the user name and password are part of the body, if they are not return an error
    if (!req.body.userName || !req.body.userPassword) {
      res.status(400);
      throw new Error("userName or userPassword not included in request body.");
    }
    // Find the user with the username
    const user = await User.findOne({
      userName: req.body.userName,
    });
    // Check if the user exists, if it does not return an error
    if (!user) {
      res
        .status(402)
        .json({ error: "User " + req.body.userName + " not found." });
    } else {
      // verify the passwords match up
      const comparison = await bcrypt.compare(
        req.body.userPassword,
        user.userPassword
      );
      // If they do, get a new JSON Web Token for this user and return it
      if (comparison) {
        const token = await jwt.sign({ userName: user.userName }, SECRET);
        // Cookie settings
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
    // Catch and return any errors
    const errMessage = error.message;
    res.status(400).json({ error: errMessage });
  }
});

// Controller function to update a user document in the database. User update requests in the account page will be processed using this function.
const updateUser = asyncHandler(async (req, res) => {
  try {
    // Check if the new username/email that the user wants to change exists in the backend
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
    // If they do already exist, return a descriptive error
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
      // If they do not already exist find the user document to update
      const user = await User.findOne({ userName: req.params.userName });
      let request = { ...req.body };
      // If it does not exist return an error
      if (!user) {
        res.status(400);
        throw new Error("User " + req.params.userName + " not found.");
      }
      // Change the user password by encrypting it first
      if (req.body.userPassword) {
        const hashedPassword = await bcrypt.hash(req.body.userPassword, 10);
        request.userPassword = hashedPassword;
      }
      //console.log("Original request: " + JSON.stringify(req.body));
      //console.log("New request: " + JSON.stringify(request));

      // Update the user with the request body information
      const updatedUser = await User.findByIdAndUpdate(user._id, request, {
        new: true,
      });

      let update = {
        user_id: user._id,
        request: request,
        type: "updateUser",
      };

      let serverHttpUpdates = getServerHttpUpdates();

      for (const [key, value] of Object.entries(serverHttpUpdates)) {
        let tempUpdates = [...value];

        tempUpdates.push(update);

        serverHttpUpdates[key] = tempUpdates;
      }

      setServerHttpUpdates(serverHttpUpdates);
      //      const response = Workspace.updateMany(
      //        { workspaceOwner: userName },
      //        { $set: { workspaceOwner: updatedUser.userName } }
      //      );
      //      console.log(response);

      // Upon update success, send back new user information
      res.status(200).json({ updatedUser });
    }
  } catch (error) {
    // Catch and return any errors
    const errMessage = error.message;
    res.status(400).json({ error: errMessage });
  }
  // Check if this request was broadcasted by other servers, if it was not (it was a client request) then broadcast it to other servers using broadcast helper
  if (!req.body.isBroadcast)
    putBroadCast(
      `/users/${req.params.userName}/`,
      req.body,
      req.headers.authorization.split(" ")[1]
    );
});

// Function to get user info for a specific user document. This is done when a user is signed in to retrieve details about their account that are used in the frontend.
const getUserInfo = asyncHandler(async (req, res) => {
  try {
    // Get the existing user information
    const existingUser = await User.find({
      userName: req.params.userName,
    });
    // If the user does not exist, return an error
    if (!existingUser) {
      res.status(400);
      throw new Error('User "' + req.params.userName + '" not found.');
    }
    // Get the user information from the query and return it (except the password)
    const userInfo = existingUser[0];
    res.status(200).json({
      userName: userInfo.userName,
      userEmail: userInfo.userEmail,
      userFirstName: userInfo.userFirstName,
      userLastName: userInfo.userLastName,
    });
  } catch (error) {
    // catch and return any errors
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

export { createUser, deleteUser, getUser, updateUser, getUserInfo };
