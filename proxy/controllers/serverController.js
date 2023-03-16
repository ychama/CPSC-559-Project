import asyncHandler from "express-async-handler";

const SERVER_BASE_URL = "http://backend{}:5000/api";
let AVAILABLE_SERVERS = [1, 2];
let OFFLINE_SERVERS = [];

const getServer = asyncHandler(async (req, res) => {
  try {
    const randomServer = Math.floor(Math.random() * AVAILABLE_SERVERS.length);

    let serverURL = SERVER_BASE_URL.replaceAll(
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
