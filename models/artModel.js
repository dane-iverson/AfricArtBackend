import mongoose from "mongoose";

const artSchema = mongoose.Schema(
  {
    // Title of the artwork
    title: {
      type: String,
      required: true,
    },
    // Name of the artist
    artist: {
      type: String,
      required: true,
    },
    // Size of the artwork
    size: {
      type: String,
      required: true,
    },
    // Medium used for the artwork (e.g., oil on canvas)
    medium: {
      type: String,
      required: true,
    },
    // Description of the artist
    description: {
      type: String,
      required: true,
      maxLength: 500, // Limit description to 500 characters
    },
    // URL to the image of the artwork
    image: {
      type: String,
      required: true,
    },
  },
  {
    // Automatically add timestamps for creation and updates
    timestamps: true,
  }
);

// Create and export the Art model based on the schema
export const Art = mongoose.model("Art", artSchema);
