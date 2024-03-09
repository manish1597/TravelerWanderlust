



const maptilerClient = require('@maptiler/client');
const mapToken=process.env.MAP_TOKEN ;

maptilerClient.config.apiKey = mapToken;









const Listing = require("../models/listing");


module.exports.index=async (req,res)=>{
    const allListings= await Listing.find({}); 
    res.render("./listings/index.ejs",{allListings}); 
}

module.exports.renderNewForm=(req,res)=>{
    // console.log(req.user);
    res.render("./listings/new.ejs");

}


module.exports.showListing=async (req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",//nested populate for each review has its author
              populate:{
                path:"author",
              },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings"); 
    }
    // console.log(listing);
    res.render("./listings/show.ejs",{listing});


}


module.exports.createListing=async (req,res,next)=>{ //validateListing middlware validate listing first then following job will be done
   
 const loc=req.body.listing.location;
 

const response = await maptilerClient.geocoding.forward(loc, {
    limit: 1,
});
// console.log(response.features[0].geometry);
 


   
    let url=req.file.path;
   let filename=req.file.filename;
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.features[0].geometry;
     let saveListing= await newListing.save();
     console.log(saveListing);
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
    
}


module.exports.renderEditForm=async (req,res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings"); 
    }
     console.log(listing.image.url);

    let originalImageUrl=listing.image.url;

     originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250,");
    res.render("./listings/edit.ejs",{listing,originalImageUrl});
    
};

module.exports.updateListing=async (req,res)=>{

    let {id}= req.params;
    // we are updating on the basis of id 
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing}); // we deconstruct treated as single body
    if(typeof req.file !== "undefined"){//below code apply only when we upload new image
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
  
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`); //redirect to show route
    
    
    
}

module.exports.destroyListing=async (req,res)=>{
    let {id}= req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
    
     
    
}