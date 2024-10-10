const error = require("mongoose/lib/error/index.js");
const Listing = require("../model/listing.js"); // Listing is model
const User = require("../model/user.js"); // user model
const flash = require("connect-flash");
// loadsh
const cloneDeep = require("lodash/cloneDeep"); //

const { populate } = require("dotenv");
const statusCodes = require("../utility/statuscoded.js");
const { stat } = require("fs/promises");

// caching functions
const NodeCache = require("node-cache"); //cache module
let mycache = new NodeCache(); //cache instance is created
// working
// get all data
async function handleRetrieveData(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8; // items per page
    const skip = (page - 1) * limit; // 2-1 *10 =10 3-1*10 =20 skip items
    let data;
    const data_retrieve = `page_${page}_limit_${limit}`;
    console.log(data_retrieve);
    if (mycache.has(data_retrieve)) {
      console.log("Cache hit");
      data = await mycache.get(data_retrieve);
    } else {
      console.log("Cache miss, fetching from DB");
      mycache.del(data_retrieve);
      data = await Listing.find({}).skip(skip).limit(limit).lean();
      // console.log(data);
      mycache.set(data_retrieve, data);
    }

    const success = req.flash("success");
    const error = req.flash("error");
    res
      .status(statusCodes.OK)
      .render("listing/listing.ejs", { data, success, error, page, limit });
  } catch (e) {
    console.log("error ", e);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .render("../views/listing/error.ejs");
  }
}
// async function handleRetrieveData(req, res) {
//   try {
//     const page = parseInt(req.query.page) || 1; // current page
//     const limit = 5; // items per page
//     const skip = (page - 1) * limit;

//     let data;

//     if (mycache.has("data_page_" + page)) {
//       console.log("Cache hit");
//       data = mycache.get("data_page_" + page);
//     } else {
//       console.log("Cache miss, fetching from DB");
//       data = await Listing.find({}).lean().skip(skip).limit(limit);
//       mycache.set("data_page_" + page, data);
//     }

//     // Get total count of listings for pagination
//     const totalItems = await Listing.countDocuments({});
//     const totalPages = Math.ceil(totalItems / limit);

//     const success = req.flash("success");
//     const error = req.flash("error");

//     res.status(statusCodes.OK).render("listing/listing.ejs", {
//       data,
//       success,
//       error,
//       currentPage: page,
//       totalPages,
//     });
//   } catch (e) {
//     console.log("error", e);
//     res
//       .status(statusCodes.INTERNAL_SERVER_ERROR)
//       .render("../views/listing/error.ejs");
//   }
// }

// showing by id
async function GetlistingByid(req, res) {
  let { id } = req.params;
  try {
    let listing_info;
    // const mycache_key = "getbyid";
    // if (mycache.has(mycache_key)) {
    //   console.log("Cache hit for getbyid");
    //   listing_info = await mycache.get(mycache_key);
    // } else {
    listing_info = await Listing.findById(id)
      .lean()
      .populate({
        path: "Reviews",
        populate: { path: "author" },
      })
      .populate("owner", "username");

    // console.log(listing_info);
    // let data = await Listing.findById(id).populate("owner", "username");
    // console.log(data);

    if (!listing_info) return res.status(404).send("Listing not found");

    return res.status(200).render("listing/show.ejs", {
      listing_info,
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (e) {
    console.log("error ", e);
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
    mycache.del(["data_retrieve"], ["getbyid"]); //delete cache file
    req.flash("success", "Successfully added");
    res.status(statusCodes.OK).redirect("/listings");
  } catch (error) {
    // console.log(error);
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json("something went wrong please try again");
  }
}
// edit data
async function ListingEditDataById(req, res) {
  try {
    const { id } = req.params;
    mycache.del("data_retrieve"); //delete cache file
    mycache.del("getbyid");
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
    res.status(statusCodes.OK).redirect(`/listings/${id}`);
  } catch (error) {
    // console.log(error);
    // res.render("../views/listing/error.ejs");
    console.log(error);
    req.flash("error", "something is wrong ");
    res.sataus(statusCodes.BAD_REQUEST).redirect(`/listings/${id}`);
  }
}
//delete by id
const ListingdeleteById = async (req, res) => {
  try {
    let id = req.params.id;
    mycache.flushAll();
    if (!id) {
      return res.status(statusCodes.NOT_FOUND).send("Not Found");
    }
    let del = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted");
    res.status(statusCodes.OK).redirect("/listings");
    // console.log("this is delete data ", del);
  } catch (e) {
    res
      .status(statusCodes.BAD_REQUEST)
      .json("something happened when trying to delete ");
  }
};

module.exports = {
  handleRetrieveData,
  GetlistingByid,
  ListingNewDataInsert,
  ListingEditDataById,
  ListingdeleteById,
};
