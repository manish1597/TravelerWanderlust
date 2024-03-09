const express =require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing= require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")
const listingController =require("../controllers/listing.js");
const multer  = require('multer')//fetch image from file
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage });//multer store files in cloudinary storage


router.route("/")

// Index Route
.get(wrapAsync(listingController.index))
//Create new route
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.createListing ));


//New Route  for create new listing
router.get("/new",isLoggedIn, listingController.renderNewForm)  



router.route("/:id")
// Show Route 
.get(wrapAsync(listingController.showListing))
// Update Route
.put(
    isLoggedIn,
    isOwner, 
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
    )

// Delete route
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));




// EDIT route

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));




module.exports =router;