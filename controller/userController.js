const User_model = require("../model/user");
const passport = require("passport");
const statusCodes = require("../utility/statuscoded.js");
const sendVerificationEmail = require("../utility/sendmail.js");

//crete new user
const sendVerificationCode = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("sendVerificationCode", username, email, password);
  try {
    const existing_user_email = await User_model.findOne({ email });
    if (existing_user_email) {
      req.flash("error", "Email already in use");
      return res.status(statusCodes.OK).redirect("/signUp");
    }
    // verification code
    const verification_code = Math.floor(1000 + Math.random() * 9000);
    // Store the username, email, password, and verification code in the session
    console.log(verification_code);
    req.session.tempUser = {
      username,
      email,
      password,
      code: verification_code,
    };
    // console.log("this is sessions", req.session.tempUser);

    // Send the verification code via email
    await sendVerificationEmail(email, verification_code);

    req.flash(
      "success",
      "Verification email sent successfully. Please enter the code to continue."
    );
    return res.status(statusCodes.OK).redirect("/user/verify_code");
  } catch (err) {
    console.error("Error during sending verification email:", err);
    req.flash(
      "error",
      "An error occurred while sending the verification code."
    );
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).redirect("/signUp");
  }
};
// verify the user
const verifyCodeAndSignUp = async (req, res) => {
  // console.log("verifyCodeAndSignUp");
  let { code } = req.body;
  // console.log(`Verifying code`, code);

  const {
    username,
    email,
    password,
    code: verification_code,
  } = req.session.tempUser;

  if (!username || !email || !password || !verification_code) {
    req.flash("error", "Session expired. Please try again.");
    return res.status(statusCodes.OK).redirect("/signUp");
  }
  try {
    // Create new

    if (code == verification_code) {
      const newUser = new User_model({
        username,
        email,
      });

      // Register user with passport
      const register_User = await User_model.register(newUser, password);
      // console.log("Registered user:", register_User);

      // Automatically log in the new user
      req.login(register_User, function (err) {
        if (err) {
          return next(err);
        }
        req.session.tempUser = null;
        // Flash
        req.flash("success", `User registered successfully. `);

        // Redirect
        return res.status(statusCodes.OK).redirect("/listings");
      });
    } else {
      req.flash("error", "Verification code is not correct");
      return res.status(statusCodes.OK).redirect("/signUp");
    }
  } catch (err) {
    console.error("Error during registration:", err);

    // Flash error
    req.flash("error", "An error occurred during registration");
    return res
      .status(statusCodes.UNAUTHORIZED)
      .render("../views/user/signUp.ejs");
  }
};

module.exports = {
  sendVerificationCode,
  verifyCodeAndSignUp,
};
