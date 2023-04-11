import mongoose from "mongoose";

// Configuration to establish a connection to the MongoDB instance using the environment variable URL
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connection successful!");
    process.env.DB_CONNECTED = "true";
  } catch (error) {
    console.log("Failure connecting to MongoDB. Logging error details...");
    console.log(error);
    process.exit(1);
  }
};

export default connectMongoDB;
