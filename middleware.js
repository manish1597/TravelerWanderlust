const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js"); //requiring joi for server side validation



 module.exports.isLoggedIn=(req,res,next)=> 
 {
    
    // console.log(req.path, "...", req.originalUrl);
    // console.log(req.user); passport save user info in req.user
    if(!req.isAuthenticated()){
        // IMP   we put in isAuthenticated because first we fetch path then login and 
        // then redirect to this path
        req.session.redirectUrl=req.originalUrl;
        
        req.flash("error","you must be logged in to create Listing!" )
        return res.redirect("/login");
    }
    next();
}   


// but after login passport by default refresh the redirectUrl hence we save into req.locals

module.exports.saveRedirectUrl=(req,res,next) =>{
    // if it is save then save to locals
    if( req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;

    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} =req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} =req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}




// server side validation
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
   
    if(error){
        let  errMsg=error.details.map((el)=> el.message).join(",");//all details info map 
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}


// server side validation
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
   
    if(error){
        let  errMsg=error.details.map((el)=> el.message).join(",");//all details info map 
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

} 
