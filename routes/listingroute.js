const express = require("express");
const router = express.Router();
const Listing = require("../model/listing"); //Listing is model
const multer = require("multer"); //used to upload photo
const upload = multer({ dest: "uploads/" });
const {
  Schema_validation,
  Review_Schema_validation,
} = require("../middleware/schema_validation.js");
const isLogin = require("../middleware/LoginAuthenticate.js");
const isOwner = require("../middleware/authorizationOwner.js");

const {
  handleRetrieveData,
  GetlistingByid,
  ListingNewDataInsert,
  ListingEditDataById,
  ListingdeleteById,
} = require("../controller/listingController.js");

// List all data
router.get("", handleRetrieveData);

// Render new data form
router.get("/new", isLogin, function (req, res) {
  return res.render("../views/listing/new.ejs");
});

// Show listing by id
router.get("/:id", GetlistingByid);

// Insert new data into database
router.post(
  "",
  isLogin,
  upload.single("img_file"),
  Schema_validation,
  ListingNewDataInsert
);

// Render edit form
router.get("/:id/edit", isLogin, isOwner, async function (req, res) {
  let { id } = req.params;
  const listing_info = await Listing.findById(id);
  res.render("../views/listing/edit.ejs", { listing_info });
});

// Update data
router.put("/:id", isLogin, isOwner, ListingEditDataById);

// Delete operation
router.get("/:id/delete", isLogin, isOwner, ListingdeleteById);

module.exports = router;
