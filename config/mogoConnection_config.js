const mongoose = require("mongoose");
// listing model
require("dotenv").config();
// console.log(process.env);
// mongoose
//   .connect("mongodb://localhost/stayhome")
//   .then(() => console.log("Database connection established locally"))
//   .catch((error) => console.error("Database connection error:", error));
mongoose
  .connect(process.env.MONGODB_ATLAS, {})
  .then(() => console.log("Database connection established"))
  .catch((error) => console.error("Database connection error:", error));
