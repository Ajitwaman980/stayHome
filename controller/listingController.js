const error = require("mongoose/lib/error/index.js");
const Listing = require("../model/listing.js"); // Listing is model
const User=require("../model/user.js")// user model
const flash = require("connect-flash");
// loadsh
const cloneDeep = require("lodash/cloneDeep"); //
const NodeCache = require("node-cache"); //cache module
const { populate } = require("dotenv");

let mycache = new NodeCache(); //cache instance is created
// working
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
    //  const user=await User.find({});
    //  console.log("this is user mdel ",user);

    const success = req.flash("success");
    const error = req.flash("error");
    res.render("../views/listing/listing.ejs", { data, success, error });
  } catch (e) {
    res.render("../views/listing/error.ejs");
  }
}

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

    if (!listing_info) return res.status(4040).send("something went wrong");

    return res.render("../views/listing/show.ejs", {
      listing_info,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (e) {
    // console.log("error ", e);
    res.render("../views/listing/error.ejs");
  }
}

async function ListingNewDataInsert(req, res) {
  try {
    
    const { title, description, price, location, country,bed,bathroom ,areaHousewidth,areaHouseheight} = req.body;
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
      owner: req.user._id,
    });

    newListing.image = { Url, fileName };
    await newListing.save();
    // console.log("images add in cloudinary");
    req.flash("success", "Successfully added");
    res.redirect("/listings");
  } catch (error) {
    // console.log(error);
    res.render("../views/listing/error.ejs");
  }
}
// edit data
async function ListingEditDataById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send("Not Found");
    }

    const { title, description, price, location, country,bed,bathroom ,areaHousewidth,areaHouseheight } = req.body;
    let Update_listing = await Listing.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        location,
        country,
        bed,
        bathroom,
        areaHousewidth,
        areaHouseheight,
      },
      { new: true }
    );
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
    // console.log(error);
    // res.render("../views/listing/error.ejs");
    req.flash("error", "something is wrong ");
    res.redirect("/listings");
  }
}

const ListingdeleteById = async (req, res) => {
  try {
    let id = req.params.id;

    if (!id) {
      return res.status(404).send("Not Found");
    }
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
