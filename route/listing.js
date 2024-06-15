const express = require("express");
const router = express.Router();           // creating our router object//
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controller/listings.js");

 

 //INDEX ROUTE
router.get("/", wrapAsync(listingController.index));
  //New Route
 router.get("/new", isLoggedIn,listingController.renderNewForm);
 //SHOW ROUTE
 router.get("/:id",wrapAsync(listingController.showListing));
 //CREATE ROUTE
 router.post("/", isLoggedIn,validateListing,wrapAsync(listingController.createListing) );
 //EDIT ROUTE
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync( listingController.renderEditForm));
 //UPDATE ROUTE
 router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing ));
   //Delete Route
 router.delete("/:id",isLoggedIn, isOwner,wrapAsync(listingController.destroyListings));
   

module.exports=router;
