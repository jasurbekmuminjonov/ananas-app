const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    video_name: {
      type: String,
      required: true,
      trim: true,
    },
    video_type: {
      type: String,
      required: true,
    },
    video_size: {
      type: Number,
      required: true,
    },
    video_id: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", VideoSchema);
