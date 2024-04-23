var express = require('express');
var router = express.Router();
const Listing = require("../model/listing");

/* GET home page. */
router.get('/',async function(req, res) {
  res.send("<a href='/signUp'><button> Sign Up</button></a>");
  // res.send(data)
});

module.exports = router;
