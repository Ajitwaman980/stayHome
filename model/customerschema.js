const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,

    },
    stripeCustomerId: {
      type: String,
      required: true
    }
  }, { timestamps: true });
  
const customer=mongoose.model("Customer", customerSchema);
module.exports=customer;