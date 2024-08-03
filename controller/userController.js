const User_model = require("../model/user");
const passport = require("passport");
const NewUserCrete = async (req, res) => {
  let { username, email, password } = req.body;

  try {
    // check alredy persent or not
    const exiting_user_email = await User_model.findOne({ email });
    if (exiting_user_email) {
      req.flash("error", "Email already in use");
      return res.redirect("/signUp");
    }

    // dicount code generated
    const discountCode = Math.floor(Math.random() * 10000);
    // new user create using username and email
    const newUser = new User_model({ username, email ,discountCode,discount: true,});


    const register_User = await User_model.register(newUser, password);
    console.log("register user", register_User);
    req.login(register_User, function (err) {
      if (err) {
        return next(err);
      }
      // req.flash("success", "User Login Success");
      req.flash("success",`User Login Success. You get 50% off on your first booking with code: ${discountCode}`)

      res.redirect("/listings");
    });
  } catch (err) {
    // console.error(err);
    req.flash("error", "An error occurred during registration");
    return res.render("../views/user/signUp.ejs");
  }
};

module.exports = NewUserCrete;
