const express = require("express");
const router = express.Router();           // creating our router object//
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {listingSchema,reviewSchema}=require("../schema.js");



const validateListing=(req,res,next)=>{
     let {error}=listingSchema.validate(req.body);
     // console.log(result);
     if(error){
         let errMsg=error.details.map((el)=>el.message).join(",");
         throw new ExpressError(400,errMsg);
     }
     else {
         next();
     }
 }
 const validateReview=(req,res,next)=>{
     let {error}=reviewSchema.validate(req.body);
     // console.log(result);
     if(error){
         let errMsg=error.details.map((el)=>el.message).join(",");
         throw new ExpressError(400,errMsg);
     }
     else {
         next();
     }
 }

 //INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
     const allListings = await Listing.find({});
     res.render("listings/index.ejs", { allListings });
   }));
  //New Route
 router.get("/new", (req, res) => {
     res.render("listings/new.ejs");
 });
 //SHOW ROUTE
 router.get("/:id",wrapAsync( async (req, res) => {
     let { id } = req.params;
     const listing = await Listing.findById(id).populate("reviews");
     res.render("listings/show.ejs", { listing });
 }));
 //CREATE ROUTE
 router.post("/", validateListing,wrapAsync(async(req,res,next)=>{
     const newListing = new Listing(req.body.listing);
     
     await newListing.save();
     res.redirect("/listings");
 }) );
 //EDIT ROUTE
 router.get("/:id/edit",wrapAsync( async (req, res) => {
     let { id } = req.params;
     const listing = await Listing.findById(id);
     res.render("listings/edit.ejs", { listing });
   }));
 //UPDATE ROUTE
 router.put("/:id",validateListing,wrapAsync( async (req, res) => {
     let { id } = req.params;
     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     res.redirect(`/listings/${id}`);
   }));
   //Delete Route
 router.delete("/:id", wrapAsync(async (req, res) => {
     let { id } = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     res.redirect("/listings");
   }));
   //REVIEWS POST ROUTE
   router.post("/:id/reviews",validateReview ,wrapAsync(async(req,res)=>{
     let listing=await Listing.findById(req.params.id);
     let newReview=new Review(req.body.review);
     listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();
     res.redirect(`/listings/${listing._id}`);
   }));
   //DELETE REVIEW ROUTE
   router.delete("/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
     let {id,reviewId}=req.params;
     Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     await Review.findByIdAndDelete(reviewId);
     res.redirect(`/listings/${id}`)
   }));

   module.exports=router;