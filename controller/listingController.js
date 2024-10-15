const error = require("mongoose/lib/error/index.js");
const Listing = require("../model/listing.js"); // Listing model
const User = require("../model/user.js"); // User model
const flash = require("connect-flash");

const statusCodes = require("../utility/statuscoded.js");

// Caching functions
const NodeCache = require("node-cache"); // Cache module
let mycache = new NodeCache(); // Cache instance is created
const Redis = require("redis");
// const redisclient = require("../config/Redis_connections.js");
// const redisclient = Redis.createClient({
//   url: "redis://localhost:6379",
// });

// redisclient.on("error", (err) => {
//   console.error("Redis error:", err);
// });
// async function connect() {
//   try {
//     await redisclient.connect();
//     console.log("Connected to Redis");
//   } catch (err) {
//     console.error("Error connecting to Redis:", err);
//     process.exit(1);
//   }
// }

// // Call the connect function
// connect();

// Get all listings with pagination
async function handleRetrieveData(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8; // Items per page
    const skip = (page - 1) * limit; // Skip items for pagination
    let data;
    const data_retrieve = `page_${page}_limit_${limit}`;

    // redis
    // const cachedData = await redisclient.get(data_retrieve);

    // if (cachedData) {
    //   console.log("Cache hit");
    //   data = JSON.parse(cachedData);
    // } else {
    //   console.log("Cache miss, fetching from DB");
    data = await Listing.find({}).skip(skip).limit(limit).lean();
    //   redisclient.setEx(data_retrieve, 3600, JSON.stringify(data));
    // }

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

// Get listing by ID
async function GetlistingByid(req, res) {
  let { id } = req.params;
  try {
    let listing_info = await Listing.findById(id)
      .lean()
      .populate({
        path: "Reviews",
        populate: { path: "author" },
      })
      .populate("owner", "username");

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

// Insert new listing data
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

    let image;
    if (req.file) {
      image = req.file.path;
    }

    const newListing = new Listing({
      title,
      description,
      image: { Url: image, fileName: req.file.filename },
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

    await newListing.save();
    mycache.del(["data_retrieve"], ["getbyid"]); // Delete cache file
    req.flash("success", "Successfully added");
    res.status(statusCodes.OK).redirect("/listings");
  } catch (error) {
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json("something went wrong please try again");
  }
}

// Edit existing listing data by ID
async function ListingEditDataById(req, res) {
  try {
    const { id } = req.params;
    mycache.del("data_retrieve"); // Delete cache file
    mycache.del("getbyid");
    if (!id) {
      return res.status(404).send("Not Found");
    }

    let Update_listing = await Listing.findByIdAndUpdate(
      id,
      {
        ...req.body, // Destructuring used
      },
      { new: true }
    );

    if (req.file) {
      Update_listing.image = {
        Url: req.file.path,
        fileName: req.file.filename,
      };
    }
    await Update_listing.save();

    req.flash("success", "Successfully Updated List");
    res.status(statusCodes.OK).redirect(`/listings/${id}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "something is wrong ");
    res.status(statusCodes.BAD_REQUEST).redirect(`/listings/${id}`);
  }
}

// Delete listing by ID
const ListingdeleteById = async (req, res) => {
  try {
    let id = req.params.id;
    mycache.flushAll();
    if (!id) {
      return res.status(statusCodes.NOT_FOUND).send("Not Found");
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted");
    res.status(statusCodes.OK).redirect("/listings");
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
