import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connection successful!");
  } catch (error) {
    console.log("Failure connecting to MongoDB. Logging error details...");
    console.log(error);
    process.exit(1);
  }
};

export default connectMongoDB;
