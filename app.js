const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

//routes

const methodOverride = require("method-override");

const ejs = require("ejs");
const ejsMate = require("ejs-mate"); // Boilerplate ejs
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const passport_local_mongoose = require("passport-local-mongoose");
const Localpassport = require("passport-local");
const User_model = require("./model/user");
const { env } = require("process");
const ConnectDB = require("./config/mogoConnection_config");
const app = express();
// csp helmet

// clustring
const cluster = require("cluster");
const os = require("os");
const dotenv = require("dotenv");
const limiterConfig = require("./middleware/services/limiter");

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

// helmet csp  Content Security Policy
// Session Setup

// store in atlas
const store = MongoStore.create({
  mongoUrl: process.env.mogodb_local,
  collectionName: "sessions",
  crypto: {
    secret: process.env.SESSION_SCERT,
  },
  touchAfter: 24 * 3600, // time period in seconds
});
// Session setup
app.use(
  session({
    store,
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SCERT,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);
// flash
app.use(flash());

// authentication middleware  Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localpassport(User_model.authenticate()));
passport.serializeUser(User_model.serializeUser());
passport.deserializeUser(User_model.deserializeUser());

// middleware for local vriables stored in session
app.use((req, res, next) => {
  console.log((res.locals.currentUsser = req.user));
  // stored the user data
  res.locals.currentUser = req.user;
  next();
});

// Routes middleware
app.use("/", require("./routes/index"));
app.use("/listings", limiterConfig, require("./routes/listingroute"));
app.use(
  "/listings/:id/reviews",
  limiterConfig,
  require("./routes/reviewsRoute")
);
app.use("/", limiterConfig, require("./routes/usersRoute"));
app.use("/listings/category", limiterConfig, require("./routes/category"));
app.use("/user/v1", limiterConfig, require("./routes/userprofileRoutes"));

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err);
  // Render the error page
  res.status(err.status || 500);
  return res.render("listing/error.ejs");
});
// ........... cluster.........
// const total_number_of_cpus = os.cpus().length;
// if (cluster.isPrimary) {
//   for (let i = 0; i < total_number_of_cpus; i++) {
//     cluster.fork();
//   }
//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`worked died ${process.worker.pid}`);
//     cluster.fork();
//   });
// } else {
//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }
module.exports = app;
