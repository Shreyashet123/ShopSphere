const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require('../middleware/authmiddleware');

const router=express.Router();

router.get("/",protect,admin, async (req, res) => {
    try {
      const products = await Product.find({}).select("name reviews");
  
      const allReviews = products.flatMap((product) =>
        product.reviews.map((review) => ({
            ...review._doc,
            productId: product._id,
            product: {
              name: product.name, // ✅ This is what your frontend expects
            },
          }))
      );
  
      res.status(200).json(allReviews);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  

  router.delete("/:productId/:reviewId",protect,admin, async (req, res) => {
    const { productId, reviewId } = req.params;
  
    try {
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      // Filter out the review
      product.reviews = product.reviews.filter(
        (review) => review._id.toString() !== reviewId
      );
  
      // Update numReviews and averageRating
      product.numReviews = product.reviews.length;
      product.averageRating =
        product.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
          product.reviews.length || 0;
  
      await product.save();
  
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });
  module.exports=router;