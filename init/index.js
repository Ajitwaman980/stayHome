const mongoose = require("mongoose");
const Listing = require("../model/listing");
const initialized_data = require("./data");
// require("dotenv").config();
mongoose
  .connect("mongodb://127.0.0.1:27017/StaySimple", {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB", error));
const initialize_data_base = async function () {
  await Listing.deleteMany({});
  initialized_data.data = initialized_data.data.map(function (obj) {
    return { ...obj, owner: "6626a9fa9d428e9364254127" };
  });

  await Listing.insertMany(initialized_data.data);
  console.log("data was initialized");
};
initialize_data_base();
