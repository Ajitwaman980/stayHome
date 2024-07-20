const mongoose = require("mongoose");
// listing model
require("dotenv").config();
// console.log(process.env);
mongoose
  .connect(process.env.MongodbAtlas, {})
  .then(() => console.log("Database connection established"))
  .catch((error) => console.error("Database connection error:", error));
