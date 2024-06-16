const express = require("express");
const router = express.Router({mergeParams: true}); 
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const Review=require("../models/review.js");
const reviewController=require("../controller/reviews.js");

  //REVIEWS POST ROUTE
  router.post("/",isLoggedIn,validateReview ,wrapAsync(reviewController.createReview));
  //DELETE REVIEW ROUTE
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
  module.exports=router;
