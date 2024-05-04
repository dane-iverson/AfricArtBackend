import express from "express";
import { Art } from "../models/artModel.js";
import multer from "multer";
import { fileURLToPath } from "url";
import path, { join } from "path";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/Images"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// Middleware to verify user token
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json("Token not available.");
  } else {
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
      if (err) return res.json("Token is incorrect.");
      next();
    });
  }
};

const router = express.Router();

// Serve static images
router.use("/static", express.static(join(__dirname, "public/Images")));

// Handle new art creation with file upload
router.post("/", upload.single("file"), async (request, response) => {
  try {
    // Validate request body
    if (
      !request.body.title ||
      !request.body.artist ||
      !request.body.size ||
      !request.body.medium ||
      !request.body.description ||
      !request.file.filename
    ) {
      return response.status(400).send({
        message:
          "Send all required fields: title, artist, size, region, price, and image",
      });
    }

    // Create new art object
    const newArt = {
      title: request.body.title,
      artist: request.body.artist,
      size: request.body.size,
      medium: request.body.medium,
      description: request.body.description,
      image: request.file.filename,
    };

    // Create new art in the database
    const art = await Art.create(newArt);

    // Send success response with created art
    return response.status(201).send(art);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Retrieve all art in the gallery
router.get("/", async (request, response) => {
  try {
    // Fetch all art from the database
    const gallery = await Art.find({});

    // Send response with count and data of art
    return response.status(200).json({
      count: gallery.length,
      data: gallery,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Retrieve art by ID
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    // Find art by ID in the database
    const art = await Art.findById(id);

    // Send response with found art
    return response.status(200).json(art);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Update art information by ID
router.put("/:id", async (request, response) => {
  try {
    // Validate request body
    if (
      !request.body.title ||
      !request.body.artist ||
      !request.body.size ||
      !request.body.medium ||
      !request.body.description
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, artist, size, and medium",
      });
    }

    const { id } = request.params;

    // Update art in the database
    const result = await Art.findByIdAndUpdate(id, request.body);

    // Check if art was found and updated
    if (!result) {
      return response.status(404).json({ message: "Art not found" });
    }

    // Send success response for art update
    return response.status(200).send({ message: "Art updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete art by ID
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    // Find and delete art by ID in the database
    const result = await Art.findByIdAndDelete(id);

    // Check if art was found and deleted
    if (!result) {
      return response.status(404).json({ message: "Artwork not found" });
    }

    // Send success response for art deletion
    return response.status(200).send({ message: "Artwork deleted" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
