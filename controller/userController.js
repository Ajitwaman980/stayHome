const User_model = require("../model/user");
const passport = require("passport");
const NewUserCrete = async (req, res) => {
  let { username, email, password } = req.body;

  try {
    const newUser = new User_model({ username, email });
    const register_User = await User_model.register(newUser, password);
    console.log("register user", register_User);
    req.login(register_User, function (err) {
      if (err) {
        return next(err);
      }
      // req.flash("success", "User Login Success");
      res.redirect("/listings");
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred during registration");
    return res.render("../views/user/signUp.ejs");
  }
};

module.exports = NewUserCrete;
