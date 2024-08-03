const mongoose = require("mongoose");
require("dotenv").config();

const ListingSchema = mongoose.Schema({
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
  bed: {
    type: Number,
    min: 0,
  },
  bathroom: {
    type: Number,
    min: 0,
  },
  areaHousewidth: {
    type: Number,
 
    min: 0,
  },
  areaHouseheight: {
    type: Number,
   
    min: 0,
  },
}, { timestamps: true });

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;
