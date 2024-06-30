const {
  ListingSchema_validation,
  ReviewSchema_validation,
} = require("../schema_data_Validation.js");
// middleware user schema validation
const Schema_validation = function (req, res, next) {
  let result = ListingSchema_validation.validate(req.body);
  console.log(result);
  if (result.error) {
    // If there are validation errors, handle them accordingly
    // console.error(result.error);
    res.redirect("/listings");
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
    res.redirect("/listings");
  } else {
    next();
  }
};
module.exports = { Schema_validation, Review_Schema_validation };
