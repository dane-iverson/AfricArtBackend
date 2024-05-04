import mongoose from "mongoose";

// Define the schema for users
const userSchema = mongoose.Schema({
  // Name of the user
  name: {
    type: String,
    required: true,
  },
  // Email of the user (used for authentication and communication)
  email: {
    type: String,
    required: true,
  },
  // Password of the user (should be hashed for security)
  password: {
    type: String,
    required: true,
  },
  // Type of user (e.g., admin, regular user)
  userType: {
    type: String,
  },
});

// Create and export the User model based on the schema
export const User = mongoose.model("Users", userSchema);
