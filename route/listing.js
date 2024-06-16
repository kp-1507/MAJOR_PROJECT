const express = require("express");
const router = express.Router();           // creating our router object//
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controller/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});
 
router.route("/")
.get( wrapAsync(listingController.index))
.post(
        isLoggedIn,
        upload.single('listing[image]'),validateListing,
        wrapAsync(listingController.createListing)
    );
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
  //New Route
  router.get("/new", isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,upload.single('listing[image]'),isOwner,validateListing,wrapAsync(listingController.updateListing ))
.delete(isLoggedIn, isOwner,wrapAsync(listingController.destroyListings));

 
 //EDIT ROUTE
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingController.renderEditForm));
 

module.exports=router;
