const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    user_nickname: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    user_email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    balance: {
      type: Number,
      default: 0,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    user_photo: {
      type: String,
      default:
        "https://drive.google.com/thumbnail?id=1Y5mh4mzmieroBRHczQuI1o9RNPXpDu2y&sz=w1000",
    },
    otp: {
      type: String,
      required: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["unverified", "verified", "banned"],
      default: "unverified",
    },
    user_password: {
      type: String,
      // required: true,
      default: null,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
