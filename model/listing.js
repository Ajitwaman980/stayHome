const mongoose = require("mongoose");
require("dotenv").config();

// Define the Listing Schema
const ListingSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      Url: String,
      fileName: String,
    },
    price: {
      type: Number,
    },
    location: {
      type: String,
    },
    country: {
      type: String,
    },
    Reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Create the model model is listing
const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;
