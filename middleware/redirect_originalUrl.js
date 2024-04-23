module.exports = function redirect_originalUrl(req, res, next) {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
