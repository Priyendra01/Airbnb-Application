const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.review = async (req,res)=>{
    let listing =  await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   newReview.author=req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);

   
   await newReview.save();
   await listing.save();

  
   req.flash("success"," Review is added");
   res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("success"," Review is deleted");
    res.redirect(`/listings/${id}`);
   }