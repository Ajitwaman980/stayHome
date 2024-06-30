const express = require("express");
const router = express.Router();

const passport = require("passport");

const redirect_originalUrl = require("../middleware/redirect_originalUrl.js");
const NewUserCrete = require("../controller/userController");
// Sign-up routes to render the page
router.get("/signUp", async (req, res) => {
  const error = req.flash("error");
  return res.render("../views/user/signUp.ejs", { error });
});

// Get data from the client and handle sign-up
router.post("/signUp", NewUserCrete);

router.get("/login", async (req, res) => {
  const error = req.flash("error");
  res.cookie("__stripe_mid", "");
  return res.render("../views/user/login.ejs", { error });
});

router.post(
  "/login",
  redirect_originalUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "User Login Success");
    res.redirect(res.locals.redirectUrl || "/listings");
  }
);

router.get("/logout", async (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "User Logged Out");
    res.redirect("/listings");
  });
});

module.exports = router;
