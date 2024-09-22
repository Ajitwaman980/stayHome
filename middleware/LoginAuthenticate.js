module.exports =async function isLogin(req, res, next) {
  try{
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
  }catch(error){
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// module.exports = redirect_originalUrl;
