const User_model = require("../model/user");
const passport = require("passport");
const statusCodes = require("../utility/statuscoded.js");
const NewUserCrete = async (req, res, next) => {
  let { username, email, password } = req.body;

  try {
    // Check if the email is already in use
    const existing_user_email = await User_model.findOne({ email });
    if (existing_user_email) {
      req.flash("error", "Email already in use");
      return res.status(statusCodes.OK).redirect("/signUp");
    }

    // Generate a discount code
    const discountCode = Math.floor(Math.random() * 10000);

    // Create new user with username, email, and discount code
    const newUser = new User_model({
      username,
      email,
      discountCode, // Unique discount code for new user
      discount: true, // Assuming "discount" is a field to track discount eligibility
    });

    // Register user with passport
    const register_User = await User_model.register(newUser, password);
    console.log("Registered user:", register_User);

    // Automatically log in the new user
    req.login(register_User, function (err) {
      if (err) {
        return next(err); // Pass error to Express error handler
      }

      // Flash success message with discount code
      req.flash(
        "success",
        `User Login Success. You get 50% off on your first booking with code: ${discountCode}`
      );

      // Redirect to listings page after successful login
      return res.status(statusCodes.OK).redirect("/listings");
    });
  } catch (err) {
    console.error("Error during registration:", err);

    // Flash error message and re-render sign-up page
    req.flash("error", "An error occurred during registration");
    return res.status(statusCodes.UNAUTHORIZED).render("../views/user/signUp.ejs");
  }
};

module.exports = NewUserCrete;
