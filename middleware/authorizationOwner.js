const express = require("express");
const router = express.Router();
const Listing = require("../model/listing"); //Listing is model
const statuscode = require("../utility/statuscoded");
//  owner delete edit  data
const isOwner = async (req, res, next) => {
  try {
    let { id } = req.params;
    console.log("owner id is ..............", id);
    const listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
      req.flash("success", "Only owner permission to edit");
      // console.log("this is owner side");
      return res.status(statuscode.OK).redirect(`/listings`);
    }
    next();
  } catch (e) {
    console.error(e);
    req.flash("error", "Something went wrong");
    res.status(statuscode.UNAUTHORIZED).redirect("/listings");
  }
};
module.exports = isOwner;
