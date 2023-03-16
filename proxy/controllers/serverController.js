import asyncHandler from "express-async-handler";

const SERVER_BASE_URL = "http://localhost:500{}/api";
let AVAILABLE_SERVERS = [1, 2, 3, 4];
let OFFLINE_SERVERS = [];

const getServer = asyncHandler(async (req, res) => {
  try {
    const randomServer = Math.floor(Math.random() * AVAILABLE_SERVERS.length);

    let serverURL = SERVER_BASE_URL.replace(
      "{}",
      AVAILABLE_SERVERS[randomServer]
    );

    res.status(200).json({ serverURL });
  } catch (error) {
    const errMessage = error.message;
    res.status(400).json(errMessage);
  }
});

export { getServer };
