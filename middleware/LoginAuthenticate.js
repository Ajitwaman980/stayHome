const statuscode=require("../utility/statuscoded");
module.exports =async function isLogin(req, res, next) {
  try{
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.status(statuscode.OK).redirect("/login");
  }
  next();
  }catch(error){
    console.error(error);
    res.status(statuscode.UNAUTHORIZED).send("Server Error");
  }
};

// module.exports = redirect_originalUrl;
