const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/wrapAsync.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const ExpressError = require("../utility/ExpressError.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const {isLogedIn, isOwner,validateListing} = require("../Middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });
 




//index rout or //Creat rout

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLogedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.creatListing));




 //New rout
 
 router.get("/new",isLogedIn,wrapAsync(listingController.renderNewForm));

  //Update rout or  //Delete rout  or // Show Route

router.route("/:id")
.put(isLogedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLogedIn,isOwner,wrapAsync(listingController.destroyListing))
.get( wrapAsync(listingController.showListing));


 //Edit rout

 router.get("/:id/edit",isLogedIn,isOwner,wrapAsync(listingController.renderEditForm));

 



module.exports = router;