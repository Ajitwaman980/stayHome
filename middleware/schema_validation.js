const {
  ListingSchema_validation,
  ReviewSchema_validation,
} = require("../schema_data_Validation.js");
const flash = require("connect-flash");
const statuscode=require("../utility/statuscoded");
// middleware user schema validation
const Schema_validation = function (req, res, next) {
  let result = ListingSchema_validation.validate(req.body);
  // console.log(result);
  if (result.error) {
    req.flash("error", "Data is incomplete Please fill all data fields");
    res.status(statuscode.BAD_REQUEST).redirect("/listings/new");
  } else {
    next();
  }
};
// console.log(ReviewSchema_validation);
//console.log(ReviewSchema_validation);
const Review_Schema_validation = function (req, res, next) {
  let result_Review_Schema_validation = ReviewSchema_validation.validate(
    req.body
  );
  // console.log(result_Review_Schema_validation);
  if (result_Review_Schema_validation.error) {
    // console.error(result_Review_Schema_validation.error);
    req.flash("error", "Somthing is wrong");
    res.status(statuscode.BAD_REQUEST).redirect("/listings");
  } else {
    next();
  }
};
module.exports = { Schema_validation, Review_Schema_validation };
