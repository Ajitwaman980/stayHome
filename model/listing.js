// this is data base we used collections name is staysimple  listing is data base schema
const { types } = require("joi");
const mongoose = require("mongoose");
// listing model
mongoose
  .connect("mongodb://127.0.0.1:27017/StaySimple", {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB", error));

const ListingSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://images.pexels.com/photos/16573669/pexels-photo-16573669/free-photo-of-luxury-villa-house.jpeg?auto=compress&cs=tinysrgb&w=600",
    // this is set ternary operator (if?then:else)
    set: (v) =>
      v === ""
        ? "https://images.pexels.com/photos/2091166/pexels-photo-2091166.jpeg?auto=compress&cs=tinysrgb&w=600"
        : v,
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
