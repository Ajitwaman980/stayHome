const mongoose = require("mongoose");
const passport_local_mongoose = require("passport-local-mongoose");
const User_Schema = new mongoose.Schema(
  {
    email: {
      type: "String",
      required: true,
      unique: true,
    },
    // upadted data
    Useraddress: {
      type: String,
    },
    Userphone: {
      type: String,
    },
    Usercity: {
      type: String,
    },
  },
  { timestamps: true }
);
User_Schema.plugin(passport_local_mongoose);
module.exports = mongoose.model("User", User_Schema);
