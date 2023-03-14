import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
const getHealth = asyncHandler(async (req, res) => {
  try {
    const mongodb_admin = mongoose.connection.db.admin();
    const result = await mongodb_admin.command({ ping: 1 });
    res.status(200).json({ message: "alive" });
    console.log("MongoDB instance alive:", result);
  } catch (err) {
    res.status(500).json({ message: "MongoDB failure." }); // internal server error
    console.log("Error checking MongoDB status:", err);
  }
});

export { getHealth };
