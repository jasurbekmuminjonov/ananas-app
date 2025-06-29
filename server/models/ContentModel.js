// const mongoose = require("mongoose");

// const ContentSchema = new mongoose.Schema(
//   {
//     user_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     image_url: {
//       type: String,
//       required: true,
//     },
//     views: {
//       type: [
//         {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//       ],
//       default: [],
//     },
//     likes: {
//       type: [
//         {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//       ],
//       default: [],
//     },
//     caption: {
//       type: String,
//       default: "",
//     },
//     comments: {
//       type: [
//         {
//           user_id: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//           },
//           text: {
//             type: String,
//             required: true,
//           },
//           created_at: {
//             type: Date,
//             default: Date.now,
//           },
//         },
//       ],
//       default: [],
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Content", ContentSchema);

const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema(
  {
    video_file_link: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail_file_link: {
      type: String,
      required: true,
      trim: true,
    },
    content_title: {
      type: String,
      required: true,
      trim: true,
    },
    content_description: {
      type: String,
      required: true,
      trim: true,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", ContentSchema);
