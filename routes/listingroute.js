const express = require("express");
const router = express.Router();
const Listing = require("../model/listing"); //Listing is model
const multer = require("multer"); //used to upload photo
const cloudinary_for_storage = require("../utility/cloudinary.js"); //Cloudinary is model

const upload = multer({ storage: cloudinary_for_storage });
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
router.put(
  "/:id",
  isLogin,
  isOwner,
  upload.single("image"),
  ListingEditDataById
);
// searching data
// /listings/user/search
router.post("/user/search", async (req, res) => {
  let { search_content } = req.body;
  // console.log(search_content);
  let regex = new RegExp(search_content, "i");
  let search_content_new = await Listing.find({ title: regex });
  // console.log(search_content_new);
  res.render("../views/listing/searchdata", { data: search_content_new });
});

// Delete operation
router.get("/:id/delete", isLogin, isOwner, ListingdeleteById);

module.exports = router;
