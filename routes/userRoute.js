import express from "express";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// Handle user registration
router.post("/register", async (req, res) => {
  try {
    // Validate request body
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.password ||
      !req.body.userType
    ) {
      return res.status(400).send({
        message: "Send all required fields: name, email, password, user type",
      });
    }
    const { name, email, password, userType, adminKey } = req.body;

    if (userType === "User") {
      // Check if the user already exists
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(409).json({
          message: "User with this email already exists",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user object with hashed password
      const newUser = {
        name: name,
        email: email,
        password: hashedPassword,
        userType: userType,
      };

      // Create the user in the database
      const user = await User.create(newUser);

      // Send success response
      return res.status(201).json({
        message: "User created successfully",
        user: user,
      });
    } else if (userType === "Admin" && adminKey === process.env.ADMIN_KEY) {
      // Check if the user already exists
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(409).json({
          message: "User with this email already exists",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user object with hashed password
      const newUser = {
        name: name,
        email: email,
        password: hashedPassword,
        userType: userType,
      };

      // Create the user in the database
      const user = await User.create(newUser);

      // Send success response
      return res.status(201).json({
        message: "User created successfully",
        user: user,
      });
    } else if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).send({
        message: "Admin Key is incorrect.",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Handle user login
router.post("/login", async (req, res) => {
  try {
    // Validate request body
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "Send all required fields: email, password",
      });
    }
    const { email, password, adminKey, userType } = req.body;

    // Find user in the database
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        message:
          "Account does not exist. Please register an account to continue.",
      });
    }

    if (
      userType === "User" ||
      (userType === "Admin" && adminKey === process.env.ADMIN_KEY)
    ) {
      // Compare password
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // Check if JWT secret token is defined
        if (!process.env.SECRET_TOKEN) {
          throw new Error("JWT secret token is not defined");
        }

        // Generate JWT token with 1-day expiration
        const token = jwt.sign(
          { email: user.email },
          process.env.SECRET_TOKEN,
          {
            expiresIn: "1d",
          }
        );
        // Set cookie with the token
        res.cookie("token", token, { httpOnly: true });
        // Return user data and success message
        return res
          .status(200)
          .json({ message: "Success", user: { name: user.name } });
      } else {
        return res.status(401).json({ message: "The password is incorrect" });
      }
    } else if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).send({
        message: "Admin Key is incorrect.",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal server error" });
  }
});

export default router;
