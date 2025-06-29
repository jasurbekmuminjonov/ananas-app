const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    image_name: {
      type: String,
      required: true,
      trim: true,
    },
    image_type: {
      type: String,
      required: true,
    },
    image_size: {
      type: Number,
      required: true,
    },
    image_id: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", ImageSchema);
