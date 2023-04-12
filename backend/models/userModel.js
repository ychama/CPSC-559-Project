import mongoose from "mongoose";

// User Model

// This has all of the user information that is stored in the backend for a single user.
const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  userEmail: { type: String, required: true, unique: true },
  userPassword: { type: String, required: true },
  userFirstName: { type: String, required: true },
  userLastName: { type: String, required: true },
});

export default mongoose.model("User", userSchema);
