// /user/profile
const express = require("express");
const router = express.Router();
const usermodel = require("../model/user");
router.get("/:userID/profile", async (req, res) => {
  try {
    const user = await usermodel.findById(req.params.userID);
    // console.log(user);
    res.render("../views/user/userprofile.ejs", { user });
  } catch (err) {
    console.log(err);
    res.redirect("/listings");
  }
});
module.exports = router;
