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
const flash = require("connect-flash");
const {
  handleRetrieveData,
  GetlistingByid,
  ListingNewDataInsert,
  ListingEditDataById,
  ListingdeleteById,
} = require("../controller/listingController.js");
const { card_details, verifyuser } = require("../controller/payment.js");
const stripe = require("stripe")(process.env.Secret_key);

// List all data
router.get("", handleRetrieveData);

// Render new data form
router.get("/new", isLogin, function (req, res) {
  error = req.flash("error");
  return res.render("../views/listing/new.ejs", { error: error });
});

// Show listing by id
router.get("/:id", GetlistingByid);

// payment
router.get("/:id/payment", isLogin, function (req, res) {
  res.render("../views/payments/userpayment", { id: req.params.id });
});
router.post("/:id/create_customer", isLogin, verifyuser);

// card details
router.post("/:id/card_details", isLogin, card_details);

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
  if(!search_content){
    res.redirect("/listings")
  }
  // console.log(search_content);
  let regex = new RegExp(search_content, "i");
  let search_content_new = await Listing.find({ title: regex });
  // console.log(search_content_new);
  // res.json(search_content_new);
  res.render("../views/listing/searchdata", { data: search_content_new });
});

// Delete operation
router.get("/:id/delete", isLogin, isOwner, ListingdeleteById);

module.exports = router;
