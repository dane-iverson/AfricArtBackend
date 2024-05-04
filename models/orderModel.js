import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  // ID of the artwork being ordered
  artId: {
    type: String,
    required: true,
  },
  // Email of the user placing the order
  email: {
    type: String,
    required: true,
  },
  // Description or additional notes for the order
  description: {
    type: String,
    required: true,
  },
});

export const Order = mongoose.model("Orders", orderSchema);
