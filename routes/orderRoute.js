import express from "express";
import { Order } from "../models/orderModel.js";

const router = express.Router();

// Retrieve all orders
router.get("/", async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find({});

    // Send response with count and data of orders
    return res.status(200).json({
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Create a new order request
router.post("/", async (req, res) => {
  try {
    // Validate request body
    if (!req.body.email || !req.body.description || !req.body.artId) {
      return res.status(400).send({
        message: "Send all required fields: email, description, and artId",
      });
    }

    // Create new order object
    const newOrder = {
      artId: req.body.artId,
      email: req.body.email,
      description: req.body.description,
    };

    // Create the order in the database
    const order = await Order.create(newOrder);

    // Send success response with order data
    return res.status(201).json({
      message: "Order request sent successfully",
      order: order,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
