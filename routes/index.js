var express = require("express");
var router = express.Router();
const Listing = require("../model/listing");
const {
  handleRetrieveData,
  GetlistingByid,
  ListingNewDataInsert,
  ListingEditDataById,
  ListingdeleteById,
} = require("../controller/listingController.js");

// List all data
router.get("/", handleRetrieveData);
/* GET home page. */
// router.get("/", async function (req, res) {
//   res.send("<a href='/signUp'><button> Sign Up</button></a>");
//   // res.send(data)
// });
router.get("/companydata/privacy", (req, res) => {
  res.render("../views/companydata/privacy.ejs");
});
router.get("/companydata/about", (req, res) => {
  res.render("../views/companydata/about.ejs");
});
router.get("/companydata/terms", (req, res) => {
  res.render("../views/companydata/terms.ejs");
});

module.exports = router;
