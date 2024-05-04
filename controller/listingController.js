const error = require("mongoose/lib/error/index.js");
const Listing = require("../model/listing.js"); // Listing is model

async function handleRetrieveData(req, res) {
  try {
    const data = await Listing.find({});
    const success = req.flash("success");
    res.render("../views/listing/listing.ejs", { data, success });
  } catch (e) {
    res.render("../views/listing/error.ejs");
  }
}

async function GetlistingByid(req, res, error) {
  let { id } = req.params;
  try {
    const listing_info = await Listing.findById(id)
      .populate({
        path: "Reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    return res.render("../views/listing/show.ejs", { listing_info });
  } catch (e) {
    console.log("error ", e);
    res.render("../views/listing/error.ejs");
  }
}

async function ListingNewDataInsert(req, res) {
  try {
    const { title, description, price, location, country } = req.body;
    if (req.file) {
      image = req.file.path;
    }
    let Url = req.file.path;
    let fileName = req.file.filename;

    const newListing = new Listing({
      title,
      description,
      image,
      price,
      location,
      country,
      owner: req.user._id,
    });

    newListing.image = { Url, fileName };
    await newListing.save();
    console.log("images add in cloudinary");
    req.flash("success", "Successfully added");
    res.redirect("/listings");
  } catch (error) {
    console.log(error);
    res.render("../views/listing/error.ejs");
  }
}

async function ListingEditDataById(req, res) {
  try {
    const { id } = req.params;
    const { title, description, price, location, country } = req.body;
    let Update_listing = await Listing.findByIdAndUpdate(id, {
      title,
      description,
      price,
      location,
      country,
    });
    let image;
    if (req.file) {
      image = req.file.path;
      let Url = req.file.path;
      let fileName = req.file.filename;
      Update_listing.image = { Url, fileName };
      await Update_listing.save();
    }
    // console.log("this is image ", image);

    req.flash("success", "Successfully Updated List");
    res.redirect("/listings");
  } catch (error) {
    console.log(error);
    res.render("../views/listing/error.ejs");
  }
}

const ListingdeleteById = async (req, res) => {
  try {
    let id = req.params.id;
    let del = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted");
    res.redirect("/listings");
    // console.log("this is delete data ", del);
  } catch (e) {
    res.render("../views/listing/error.ejs");
  }
};

module.exports = {
  handleRetrieveData,
  GetlistingByid,
  ListingNewDataInsert,
  ListingEditDataById,
  ListingdeleteById,
};
