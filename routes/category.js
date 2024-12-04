const express = require("express");
const router = express.Router();
const Listing = require("../model/listing"); //Listing is model
const statusCodes = require("../utility/statuscoded");
// all
// router.get("/cat/all", async function (req, res) {
//   try {
//     res.redirect("/listings");
//   } catch (err) {
//     res.send({ error: err });
//   }
// });

// new
router.get("/cat/new", async function (req, res) {
  try {
    const newdata = await Listing.find().sort({ createdAt: -1 });
    //  console.log(newdata);
    res.status(statusCodes.OK).json(newdata);
    // res.render",{newdata:newdata})
  } catch (error) {
    // console.log(error);
    res.send({ error: error });
  }
});
// type of rent or sell
router.get("/cat/sell", async (req, res) => {
  try {
    // const typeofhouse = await Listing.find({ typeofhouse: req.query.typeofhouse });
    const typeofhouse = await Listing.find({ typeofhouse: "sell" });
    // console.log(typeofhouse);
    res.status(statusCodes.OK).json(typeofhouse);
  } catch (error) {
    // console.error(error);

    res
      .status(statusCodes.NOT_FOUND)
      .json({ message: "Error fetching listings" });
  }
});
// rent
router.get("/cat/rent", async (req, res) => {
  try {
    // const typeofhouse = await Listing.find({ typeofhouse: req.query.typeofhouse });
    const typeofhouse = await Listing.find({ typeofhouse: "rent" });

    // console.log(typeofhouse);
    res.status(statusCodes.OK).json(typeofhouse);
  } catch (error) {
    // console.error(error);
    res
      .status(statusCodes.NOT_FOUND)
      .json({ message: "Error fetching listings" });
  }
});
// low to high prices
router.get("/cat/low_to_high_price", async function (req, res) {
  try {
    const low_to_high_price = await Listing.find().sort({ price: 1 }); //ascending  ordered
    // console.log(low_to_high_price);

    res.status(statusCodes.OK).json(low_to_high_price);
  } catch (error) {
    // console.error(error);
    res
      .status(statusCodes.NOT_FOUND)
      .json({ message: "Error fetching listings" });
  }
});
router.get("/cat/high_to_low_price", async function (req, res) {
  try {
    const high_to_low_price = await Listing.find().sort({ price: -1 }); //descending   ordered
    // console.log(high_to_low_price);
    res.status(statusCodes.OK).json(high_to_low_price);
  } catch (error) {
    // console.error(error);
    res
      .status(statusCodes.NOT_FOUND)
      .json({ message: "Error fetching listings" });
  }
});

module.exports = router;
