// redirect original url
const statuscode = require("../utility/statuscoded");
module.exports = function redirectUrlredirectUrl(req, res, next) {
  try {
    if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
  } catch (error) {
    // console.error("Error in redirectUrl middleware:", error);
    res.status(statuscode.NOT_FOUND).redirect("/listings");
  }
};
