// /user/profile
const express = require("express");
const router = express.Router();
const usermodel = require("../model/user");
const isLogin = require("../middleware/LoginAuthenticate.js");
const passport = require("passport");
router.get("/:userID/profile", async (req, res) => {
  try {
    const user = await usermodel.findById(req.params.userID);
    // console.log(user);
    res.render("../views/user/userprofile.ejs", { user });
  } catch (err) {
    // console.log(err);
    res.redirect("/listings");
  }
});

// router to update the password
router.post("/password/update", isLogin, async function (req, res) {
  try {
    const id = req.user.id;
    const New_password = req.body.New_password;
    const user = await usermodel.findById(id);
    // Check if user exists
    if (!user) {
      console.error("User not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    //
    await user.setPassword(New_password);
    await user.save();

    console.log("New password updated successfully");
    res.json({ success: true, message: "New password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to update password" });
  }
});

module.exports = router;
