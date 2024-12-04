const mongoose = require("mongoose");
const passport_local_mongoose = require("passport-local-mongoose");
const User_Schema = new mongoose.Schema({}, { timestamps: true });
User_Schema.plugin(passport_local_mongoose);
module.exports = mongoose.model("Userprofile_edited_data", User_Schema);
