const express = require("express");
const reviewController = require("../controller/review.js");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utility/wrapAsync.js");
const ExpressError = require("../utility/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLogedIn,isReviewAuthor}=  require("../Middleware.js")


   
  
   //Review rout
   //Post review
  
   router.post("/",isLogedIn,validateReview,wrapAsync(reviewController.review));
  
   //Delete review
  
   router.delete("/:reviewId",isLogedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
  

   module.exports = router;