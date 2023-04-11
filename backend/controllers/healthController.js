import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

// Server health endpoint

// This endpoint constantly receives requests by the proxy layer (load balancers) to check the health of each server and database
// Since each server is connected to a unique database, the health check of the database is done subsequently by checking the health of the server at this endpoint
// If the server is down, the load balancer will receive a connection refused error, if the database is down, the server will receive a 500 error code with a MongoDB error message.
const getHealth = asyncHandler(async (req, res) => {
  try {
    // Create mongodb admin instance to check MongoDB instance health
    const mongodb_admin = mongoose.connection.db.admin();
    // Ping the MongoDB instance, this will fail if the database is down
    const result = await mongodb_admin.command({ ping: 1 });
    // If successful, respond to the load balancer process with a confirmation that server and database are active
    res.status(200).json({ message: "alive" });
  } catch (err) {
    // If there is an error, respond to the load balancer specifying that the MongoDB instance is down
    res.status(500).json({ message: "MongoDB failure." }); // internal server error
    console.log("Error checking MongoDB status: ", err);

    if (process.env.DB_CONNECTED) {
      console.log("Exiting server...");
      process.exit(5);
    }
  }
});

export { getHealth };
