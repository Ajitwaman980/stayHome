const error = require("mongoose/lib/error/index.js");
const Listing = require("../model/listing.js"); // Listing is model
const User = require("../model/user.js"); // user model
const flash = require("connect-flash");
// loadsh
const cloneDeep = require("lodash/cloneDeep"); //
const NodeCache = require("node-cache"); //cache module
const { populate } = require("dotenv");
const statusCodes = require("../utility/statuscoded.js");
const { stat } = require("fs/promises");
let mycache = new NodeCache(); //cache instance is created
// working
// get all data
async function handleRetrieveData(req, res) {
  try {
    // let data;
    // if (mycache.has("listing")) {
    //   data = mycache.get("listing");
    // } else {
    //   data = await Listing.find({});
    //   mycache.set("listing", cloneDeep(data));
    // }
    // res.send(data);
    const data = await Listing.find({});
    const success = req.flash("success");
    const error = req.flash("error");
    res.status(statusCodes.OK).render("listing/listing.ejs", { data, success, error });
  } catch (e) {
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .render("../views/listing/error.ejs");
  }
}
// showing by id
async function GetlistingByid(req, res) {
  let { id } = req.params;
  try {
    const listing_info = await Listing.findById(id)
      .populate({
        path: "Reviews",
        populate: { path: "author" },
      })
      .populate("owner", "username");
    // console.log(listing_info);
    // let data = await Listing.findById(id).populate("owner", "username");
    // console.log(data);
 
    if (!listing_info) return res.status(4040).send("Listing not found");

    return res.sataus().render("listing/show.ejs", {
      listing_info,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (e) {
    // console.log("error ", e);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .render("../views/listing/error.ejs");
  }
}
//new data insert
async function ListingNewDataInsert(req, res) {
  try {
    const {
      title,
      description,
      price,
      location,
      country,
      bed,
      bathroom,
      areaHousewidth,
      areaHouseheight,
      typeofhouse,
      categories,
    } = req.body;
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
      bed,
      bathroom,
      areaHousewidth,
      areaHouseheight,
      typeofhouse,
      categories,
      owner: req.user._id,
    });

    newListing.image = { Url, fileName };
    await newListing.save();
    // console.log("images add in cloudinary");
    req.flash("success", "Successfully added");
    res.status(statusCodes.OK).redirect("/listings");
  } catch (error) {
    // console.log(error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json("something went wrong please try again");
  }
}
// edit data
async function ListingEditDataById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send("Not Found");
    }
    // console.log("this is ", req.body);
    // const { title, description, price, location, country,bed,bathroom ,areaHousewidth,areaHouseheight ,categories} = req.body;
    let Update_listing = await Listing.findByIdAndUpdate(
      id,
      {
        ...req.body, //destructing used
      },
      { new: true }
    );
    let image;
    if (req.file) {
      image = req.file.path;
      let Url = req.file.path;
      let fileName = req.file.filename;
      Update_listing.image = { Url, fileName };
    }
    await Update_listing.save();

    // console.log("this is image ", image);

    req.flash("success", "Successfully Updated List");
    res.status(statusCodes.OK).redirect("/listings");
  } catch (error) {
    // console.log(error);
    // res.render("../views/listing/error.ejs");
    console.log(error);
    req.flash("error", "something is wrong ");
    res.sataus(statusCodes.BAD_REQUEST).redirect("/listings");
  }
}
//delete by id
const ListingdeleteById = async (req, res) => {
  try {
    let id = req.params.id;

    if (!id) {
      return res.status(statusCodes.NOT_FOUND).send("Not Found");
    }
    let del = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted");
    res.sataus(statusCodes.OK).redirect("/listings");
    // console.log("this is delete data ", del);
  } catch (e) {
    res.sataus(statusCodes.BAD_REQUEST).json("something happened when trying to delete ")
  }
};

module.exports = {
  handleRetrieveData,
  GetlistingByid,
  ListingNewDataInsert,
  ListingEditDataById,
  ListingdeleteById,
};
