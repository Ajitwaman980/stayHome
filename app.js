const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const methodOverride = require("method-override");
const indexRouter = require("./routes/index");
const ejs = require("ejs");
const ejsMate = require("ejs-mate"); // Boilerplate ejs
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const listingRoute = require("./routes/listingroute");
const reviewRoute = require("./routes/reviewsRoute");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passport_local_mongoose = require("passport-local-mongoose");
const Localpassport = require("passport-local");
const User_model = require("./model/user");
const userRoute = require("./routes/usersRoute");
const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// Session setup
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "Ajit waman",
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);
// flash
app.use(flash());

// authentication middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localpassport(User_model.authenticate()));

passport.serializeUser(User_model.serializeUser());
passport.deserializeUser(User_model.deserializeUser());
//
app.use((req, res, next) => {
  console.log((res.locals.currentUsser = req.user));
  // stored the user data
  res.locals.currentUser = req.user;
  next();
});
// Routes
app.use("/", indexRouter);
app.use("/uploads", express.static("uploads"));
app.use("/listings", listingRoute); //listing Route
app.use("/listings/:id/reviews", reviewRoute); //Review route
app.use("/", userRoute); //user router

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  // res.send("this is erroro");
  return res.render("listing/error.ejs");
});

module.exports = app;
