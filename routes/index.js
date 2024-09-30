var express = require("express");
var router = express.Router();
const statusCodes = require("../utility/statuscoded");
const {
  handleRetrieveData,

} = require("../controller/listingController.js");

// List all data
router.get("", handleRetrieveData);
router.get("/", handleRetrieveData);

router.get("/companydata/privacy", (req, res) => {
  res.status(statusCodes.OK).render("../views/companydata/privacy.ejs");
});
router.get("/companydata/about", (req, res) => {
  res.status(statusCodes.OK).render("../views/companydata/about.ejs");
});
router.get("/companydata/terms", (req, res) => {
  res.status(statusCodes.OK).render("../views/companydata/terms.ejs");
});

router.get("/companydata/Contact", (req, res) => {
  res.status(statusCodes.OK).send("working ........");
});

module.exports = router;