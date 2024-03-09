const Listing = require("../models/listing");
const Review= require("../models/review")
module.exports.createReview=async (req,res) =>{

    let listing= await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);//it give review object after submitting
    newReview.author=req.user._id;
   //  we have made reviews array in schema of type:objectID and push into that
    listing.reviews.push(newReview);
    console.log(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");

    console.log("new review saved");
   //  res.send("new review saved");

    res.redirect(`/listings/${listing._id}`);

}


module.exports.destroyReview=async (req,res)=>{
    let {id, reviewId} =req.params;
    // Delete revieId from Listing array hence we use $pull
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    console.log("Review is Deleted");
 
 
    res.redirect(`/listings/${id}`);
 }