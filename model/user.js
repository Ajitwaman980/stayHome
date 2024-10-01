const mongoose = require("mongoose");
const passport_local_mongoose = require("passport-local-mongoose");
const User_Schema = new mongoose.Schema({
  email: {
    type: "String",
    required: true,
    unique: true,
  },
  // discoun for new user
  // discount:{
  //     type:Boolean,//true or flase
  //     default:true

  // },
  // discountCode:{
  // type: String,
  // default: null,
  // },
  // discountUsed:{
  //     type:Boolean,//true or flase
  //     default:false,

  // }
});
User_Schema.plugin(passport_local_mongoose);
module.exports = mongoose.model("User", User_Schema);
