const Listing = require("../model/listing.js"); //Listing is mod
async function handleRetrieveData(req, res) {
  try {
    const data = await Listing.find({});
    const success = req.flash("success");

    res.render("../views/listing/listing.ejs", { data, success });
  } catch (e) {
    res.render("../views/listing/error.ejs");
  }
}
async function GetlistingByid(req, res, err) {
  let { id } = req.params; //to get id into the url
  // to find exact data with help of id
  try {
    const listing_info = await Listing.findById(id)
      .populate({
        path: "Reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    // console.log(listing_info.owner.username
    return res.render("../views/listing/show.ejs", { listing_info });
  } catch (e) {
    // res.redirect("/");
    console.log(e);

    res.render("../views/listing/error.ejs");
  }
}

async function ListingNewDataInsert(req, res) {
  try {
    const { title, description, price, location, country } = req.body;
    // let image = req.body.image;
    // if (req.file) {
    //   image = req.file.path;
    // }
    const image = req.file ? req.file.path : req.body.image;

    const newListing = new Listing({
      title,
      description,
      image,
      price,
      location,
      country,
      owner: req.user._id,
    });

    await newListing.save();
    req.flash("success", "Successfully added");
    res.redirect("/listings");
  } catch (error) {
    console.error(error);
    res.render("../views/listing/error.ejs");
  }
}

async function ListingEditDataById(req, res) {
  try {
    const { id } = req.params;
    const { title, description, image, price, location, country } = req.body;

    await Listing.findByIdAndUpdate(id, {
      title,
      description,
      image,
      price,
      location,
      country,
    });

    req.flash("success", "Successfully Updated List");
    res.redirect("/listings");
  } catch (error) {
    res.render("../views/listing/error.ejs");
  }
}
const ListingdeleteById = async (req, res) => {
  try {
    let id = req.params.id;
    let del = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted");
    res.redirect("/listings");
    console.log("this is delete data ", del);
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
