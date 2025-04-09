const Listing = require("./models/listing");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utility/ExpressError.js");
const Review = require("./models/review.js");


module.exports.isLogedIn = (req,res,next)=>{
    
  if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  next();
}

module.exports.isOwner = async (req,res,next)=>{
  let {id}= req.params;
    
     let listing = await Listing.findById(id);
     
     
      if ( !listing.owner[0].equals(req.user._id) ){
      req.flash("error","You are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
     }
     next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }
    else{
      next();
    }
  }

  module.exports. validateReview = (req,res,next)=>{
      let {error} = reviewSchema.validate(req.body);
      console.log(error);
      if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
      }
      else{
        next();
      }
    }

    module.exports.isReviewAuthor = async(req,res,next)=>{
      let {id,reviewId}= req.params;
    
      let review = await Review.findById(reviewId);
      
      
       if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id) ){
       req.flash("error","You are not the author of this review");
       return res.redirect(`/listings/${id}`);
      }
      next();
    }