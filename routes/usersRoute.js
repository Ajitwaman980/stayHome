const express = require("express");
const router = express.Router();
const passport = require("passport");
const isLogin = require("../middleware/LoginAuthenticate.js");

const redirect_originalUrl = require("../middleware/redirect_originalUrl.js");
const {
  verifyCodeAndSignUp,
  sendVerificationCode,
} = require("../controller/userController");

// limit
const Limit = require("../middleware/services/limiter.js");

// Sign-up routes to render the page
router.get("/signUp", Limit, async (req, res) => {
  const error = req.flash("error");
  return res.render("../views/user/signUp.ejs", { error });
});
// Get data from the client and handle sign-up
router.post("/signUp", Limit, sendVerificationCode);
// verify user with verification code
router.get("/user/verify_code", Limit, (req, res) => {
  const error = req.flash("error");
  const success = req.flash("success");
  return res.render("../views/user/verifyCode.ejs", { error });
});
router.post("/user/verify_code", Limit, verifyCodeAndSignUp);

router.get("/login", Limit, async (req, res) => {
  try {
    const error = req.flash("error");
    res.cookie("xyz", "welcome to stayhome login");
    return res.render("../views/user/login.ejs", { error });
  } catch (e) {
    console.log(e);
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
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
    try {
      req.flash("success", "User Login Success");
      res.cookie("user", req.user);
      res.redirect(res.locals.redirectUrl || "/listings");
    } catch (e) {
      console.error(e);
      req.flash("error", "Something went wrong");
      res.redirect("/listings");
    }
  }
);

router.get("/logout", isLogin, async (req, res, next) => {
  try {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User Logged Out");
      res.cookie("user", " ");
      res.redirect("/listings");
    });
  } catch (e) {
    console.error(e);
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
});

module.exports = router;
