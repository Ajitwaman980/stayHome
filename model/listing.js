const { types } = require("joi");
const mongoose = require("mongoose");
require("dotenv").config();

const ListingSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      lowercase: true,
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
      lowercase: true,
    },
    country: {
      type: String,
      lowercase: true,
    },
    Reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bed: {
      type: Number,
      min: 0,
    },
    bathroom: {
      type: Number,
      min: 0,
    },
    // type add sell or rent items
    typeofhouse: {
      type: String,
      require: true,
      lowercase: true,
      default: "rent",
    },

    areaHousewidth: {
      type: Number,

      min: 0,
    },
    areaHouseheight: {
      type: Number,
      min: 0,
    },
    categories: {
      type: [String],
      default: ["home"],
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;
