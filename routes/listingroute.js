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
const statusCodes = require("../utility/statuscoded");
const stripe = require("stripe")(process.env.Secret_key);
// limit
const Limit = require("../middleware/services/limiter.js");
// List all data
router.get("", handleRetrieveData);

// Render new data form
router.get("/new", isLogin, function (req, res) {
  error = req.flash("error");
  return res
    .status(statusCodes.OK)
    .render("../views/listing/new.ejs", { error: error });
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
  try {
    const listing_info = await Listing.findById(id);
    res
      .status(statusCodes.OK)
      .render("../views/listing/edit.ejs", { listing_info });
  } catch (e) {
    console.log(e);
    req.flash("error", "Something went wrong");
    res.status(statusCodes.UNAUTHORIZED).redirect("/listings");
  }
});
// Update data
router.put(
  "/:id",
  isLogin,
  isOwner,
  upload.single("image"),
  ListingEditDataById
);
// searching data  used axios

router.get("/user/search/:category", async (req, res) => {
  const category = req.params.category;
  //  console.log(category);
  if (!category) {
    return res.status(statusCodes.BAD_REQUEST).redirect("/listings");
  }
  // console.log("This is the query of category:", category);

  // insensitive regex for the category

  try {
    const data_cat = new RegExp(category, "i");

    const search_content_new = await Listing.find({
      categories: { $all: [data_cat] },
    });
    // console.log("Searching content:", search_content_new);

    res.status(statusCodes.OK).json(search_content_new);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// /listings/user/search
router.post("/user/search", async (req, res) => {
  try {
    let { search_content } = req.body;

    if (!search_content) {
      res.status(statusCodes.NOT_FOUND).redirect("/listings");
    }

    let regex = new RegExp(search_content, "i");
    let search_content_new = await Listing.find({ title: regex });
    res
      .status(statusCodes.OK)
      .render("../views/listing/searchdata", { data: search_content_new });
  } catch (e) {
    console.log(e);
    req.flash("error", "Something went wrong");
    res.status(statusCodes.NOT_FOUND).redirect("/listings");
  }
});

// Delete operation
router.get("/:id/delete", isLogin, isOwner, ListingdeleteById);

// payment
router.get("/:id/payment", isLogin, Limit, function (req, res) {
  res
    .status(statusCodes.OK)
    .render("../views/payments/userpayment", { id: req.params.id });
});
router.post("/:id/create_customer", isLogin, Limit, verifyuser);

// card details
router.post("/:id/card_details", isLogin, Limit, card_details);

module.exports = router;
