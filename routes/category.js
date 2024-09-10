const express = require("express");
const router = express.Router();
const Listing = require("../model/listing"); //Listing is model
const { times } = require("lodash");
router.get('/cat/new', async function (req, res){

    try {
        const newdata=await Listing.find().sort({createdAt: -1 });
        //  console.log(newdata);
         res.json( newdata);
        // res.render",{newdata:newdata})
    } catch (error) {
        // console.log(error);
        res.send({error: error});
        
    }

});
router.get('/cat/rent', function (req, res){

});
router.get('/cat/sell', function (req, res){

});
module.exports = router;
