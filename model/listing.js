// this is data base we used collections name is staysimple  listing is data base schema
const { types, string } = require("joi");
const mongoose = require("mongoose");
// listing model
require("dotenv").config();
// console.log(process.env);
mongoose
  .connect(process.env.MongodbAtlas, {})
  .then(() => console.log("Database connection established"))
  .catch((error) => console.error("Database connection error:", error));

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

    ref: "User", //this is user schema name
  },
});

const Listing = mongoose.model("Listing", ListingSchema); //schema
module.exports = Listing;
