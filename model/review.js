const { ref } = require("joi");
const mongoose = require("mongoose");
// new Schema
const ReviewSchema = mongoose.Schema(
  {
    comment: {
      type: String,
      lowercase: true,
    },
    Rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    CreateAt: {
      type: Date,
      default: Date.now(),
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Review", ReviewSchema);
