import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import artRoute from "./routes/artRoute.js";
import userRoute from "./routes/userRoute.js";
import orderRoute from "./routes/orderRoute.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Specify the path to the .env file in the root directory
const envPath = path.resolve(process.cwd(), "../.env");

// Load environment variables from the .env file
const result = dotenv.config({ path: envPath });

const PORT = process.env.PORT;
const mongoDBURL = process.env.mongoDBURL;

if (result.error) {
  console.error("Error loading .env file:", result.error);
} else {
  console.log("Loaded environment variables");
}

// Retrieve the current module file's path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware for parsing cookies
app.use(cookieParser());

// Serve static images from the public directory
app.use("/static", express.static(path.join(__dirname, "public/Images")));

// Middleware for parsing JSON request bodies
app.use(express.json());

// Enable CORS with specified origin and credentials
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Root route handler
app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("Welcome To AfricArt");
});

// Register routes for art, users, and orders
app.use("/art", artRoute);
app.use("/users", userRoute);
app.use("/orders", orderRoute);

// Connect to MongoDB and start the server
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
