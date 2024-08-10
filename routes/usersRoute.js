const express = require("express");
const router = express.Router();
const passport = require("passport");
const isLogin = require("../middleware/LoginAuthenticate.js");

const redirect_originalUrl = require("../middleware/redirect_originalUrl.js");
const NewUserCrete = require("../controller/userController");
// limit
const Limit = require("../middleware/services/limiter.js");

// Sign-up routes to render the page
router.get("/signUp", async (req, res) => {
  const error = req.flash("error");
  return res.render("../views/user/signUp.ejs", { error });
});

// Get data from the client and handle sign-up
router.post("/signUp", Limit, NewUserCrete);

router.get("/login", async (req, res) => {
  const error = req.flash("error");
  res.cookie("__stripe_mid", "");
  return res.render("../views/user/login.ejs", { error });
});

router.post(
  "/login",
  redirect_originalUrl,
  Limit,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),

  async (req, res) => {
    req.flash("success", "User Login Success");
    res.cookie("user", req.user);
    res.redirect(res.locals.redirectUrl || "/listings");
  }
);

router.get("/logout", isLogin, async (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "User Logged Out");
    res.cookie("user", " ");
    res.redirect("/listings");
  });
});

module.exports = router;
