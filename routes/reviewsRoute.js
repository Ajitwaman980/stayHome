const express = require("express");
const router = express.Router({ mergeParams: true });
const mongoose = require("mongoose");
const isLogin = require("../middleware/LoginAuthenticate.js");

// model
const Listing = require("../model/listing"); //Listing is model
const Review = require("../model/review");

const {
  ListingSchema_validation,
  ReviewSchema_validation,
} = require("../schema_data_Validation.js");
const {
  Schema_validation,
  Review_Schema_validation,
} = require("../middleware/schema_validation.js");
// upload images
const multer = require("multer"); //used to upload photo
const upload = multer({ dest: "uploads/" });
const statusCodes = require("../utility/statuscoded");
// reviews for place using post request req->show.ejs
router.post("", isLogin, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const { Rating, Comment } = req.body;
    // console.log("this is comment ", Comment);
    let New_review = new Review({
      Rating,
      comment: Comment,
    });
    // author
    New_review.author = req.user._id;
    // console.log(New_review.author);
    listing.Reviews.push(New_review);
    await listing.save();
    await New_review.save();
    // console.log("data stored in database");
    res.status(statusCodes.OK).redirect(`/listings/${req.params.id}`);
  } catch (e) {
    // console.log(e);
    res.status(statusCodes.BAD_REQUEST).json("something went wrong");
  }
});
// ---delete reviews
router.delete("/:reviewId", async (req, res) => {
  let { id, reviewId } = req.params;
  // console.log("this is on");
  // console.log(id,reviewId)
  try {
    await Listing.findByIdAndUpdate(id, { $pull: { Reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    // console.log("removed", id, reviewId);
    res.status(statusCodes.OK).redirect(`/listings/${id}`);
  } catch (e) {
    res.status(statusCodes.BAD_REQUEST).redirect(`/listings/${id}`);
  }
});
module.exports = router;
