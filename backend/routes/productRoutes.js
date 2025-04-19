const express=require('express')
const Product=require("../models/Product")
const {protect,admin} =require('../middleware/authmiddleware')

const router=express.Router();


//update a product
router.put("/:id",protect,admin,async(req,res)=>{
    try{
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku
        }=req.body;

        const product=await Product.findById(req.params.id);
        if(product){
            product.name=name || product.name;
            product.description=description || product.description;
            product.price=price || product.price;
            product.discountPrice=discountPrice || product.discountPrice;
            product.countInStock=countInStock || product.countInStock;
            product.category=category || product.category;
            product.brand=brand || product.brand;
            product.sizes=sizes || product.sizes;
            product.colors=colors || product.colors;
            product.collections=collections || product.collections;
            product.material=material || product.material;
            product.gender=gender || product.gender;
            product.images=images || product.images;
            product.isFeatured=isFeatured !==undefined ?isFeatured: product.isFeatured;
            product.isPublished=isPublished !==undefined ?isPublished: product.isPublished;
            product.tags=tags || product.tags;
            product.dimensions=dimensions || product.dimensions; 
            product.weight=weight || product.weight;
            product.sku=sku || product.sku;

            const updatedProduct=await product.save();
            res.json(updatedProduct);

           
        }else{
            res.status(404);
            throw new Error('Product not found');
        }

    }catch(error){
        console.error(error);
        res.status(500).send('Server Error');
    }
})
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await Product.deleteOne({ _id: req.params.id });  // Correct method

        res.json({ message: "Product removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});
//get all products
router.get("/", async (req, res) => {
    try {
      const {
        collections,
        sizes,
        colors,
        gender,
        minPrice,
        maxPrice,
        sortBy,
        search,
        category,
        material,
        brand,
        limit = 8,
        page = 1,
      } = req.query;
  
      const parsedLimit = Number(limit) || 8;
      const parsedPage = Number(page) || 1;
      const skip = (parsedPage - 1) * parsedLimit;
  
      let query = {};
  
      if (collections && collections.toLowerCase() !== "all") {
        query.collections = collections;
      }
      if (category && category.toLowerCase() !== "all") {
        query.category = category;
      }
      if (material) {
        query.material = { $in: material.split(",") };
      }
      if (brand) {
        const brandArray = brand.split(",").map((b) => new RegExp(`^${b}$`, "i"));
        query.brand = { $in: brandArray };
      }
      
      if (sizes) {
        query.sizes = { $in: sizes.split(",") };
      }
      if (colors) {
        query.colors = { $in: colors.split(",") };
      }
      if (gender) {
        query.gender = gender;
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
  
      let sort = {};
      if (sortBy) {
        switch (sortBy) {
          case "priceAsc":
            sort = { price: 1 };
            break;
          case "priceDesc":
            sort = { price: -1 };
            break;
          case "popularity":
            sort = { rating: -1 };
            break;
          default:
            break;
        }
      }
  
      console.log("Query Params:", {
        page: parsedPage,
        limit: parsedLimit,
        skip,
        query,
        sort,
      });
  
      const [products, totalCount] = await Promise.all([
        Product.find(query).sort(sort).skip(skip).limit(parsedLimit),
        Product.countDocuments(query),
      ]);
  
      res.json({ products, totalCount });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  
  
router.get("/best-seller",async(req,res)=>{
    try{
     const bestseller=await Product.findOne().sort({rating:-1});
     if(bestseller){
        res.json(bestseller);
     }else{
        res.status(404).json({message:"No Best Seller Is Found"});
     }

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
})

router.get("/new-arrivals",async(req,res)=>{
    try{
     const newArrivals=await Product.find().sort({createdAt:-1}).limit(10);
     if(newArrivals){
        res.json(newArrivals);
     }
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
    
})

//get a specifc product

//retrieve similar products on the current products gender and category
router.get("/similar/:id",async(req,res)=>{
    const {id}= req.params;
    if (!id || id === 'undefined' || id.length !== 24) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
    
    try{
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }

        const similarProducts = await Product.find({
            _id: {$ne: id},
            gender: product.gender,
            category: product.category
        }).limit(4);

        res.json(similarProducts);

    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});
    }
})

router.get("/:id",async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }else{
            res.json(product);
        }
        
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server Error"});

    }
    
})
// Add/Update Review

router.post("/review/:id", protect, async (req, res) => {
  const { rating, comment, avatar } = req.body;
  const id = req.params.id;

  try {
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      // Update existing review
      alreadyReviewed.rating = rating;
      alreadyReviewed.comment = comment;
      alreadyReviewed.avatar = avatar || alreadyReviewed.avatar;
    } else {
      // Add new review
      const review = {
        user: req.user._id,
        name: req.user.name,
        avatar,
        rating: Number(rating),
        comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
    }

    // Recalculate average rating
    product.averageRating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(200).json({
      message: "Review added/updated successfully",
      reviews: product.reviews.map((rev) => ({
        _id: rev._id,
        user: rev.user,
        name: rev.name,
        rating: rev.rating,
        comment: rev.comment,
        createdAt: rev.createdAt,
      })),
      averageRating: product.averageRating,
      numReviews: product.numReviews,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// Update a review
router.put('/review/:id/:reviewId', protect, async (req, res) => {
  const { rating, comment,avatar } = req.body;
  const { id, reviewId } = req.params;

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const review = product.reviews.id(reviewId);
  if (!review) return res.status(404).json({ message: "Review not found" });

  // Only allow review owner to edit
  if (review.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  review.rating = rating;
  review.comment = comment;
  review.avatar = avatar || review.avatar;
  
  // Recalculate before saving
  product.averageRating =
    product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
  product.numReviews = product.reviews.length;
  
  await product.save();
  
  res.json({
    reviews: product.reviews,
    averageRating: product.averageRating,
    numReviews: product.numReviews,
  });
});
router.delete('/review/:id/:reviewId', protect, async (req, res) => {
  const { id, reviewId } = req.params;

  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const review = product.reviews.find(
    (r) => r._id.toString() === reviewId
  );

  if (!review) return res.status(404).json({ message: "Review not found" });

  if (review.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  // Remove the review
  product.reviews.pull({ _id: reviewId });

  // Recalculate rating
  const averageRating = product.reviews.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  product.averageRating = averageRating;
  product.numReviews = product.reviews.length;

  await product.save();

  res.json({
    reviews: product.reviews,
    averageRating: product.averageRating,
    numReviews: product.numReviews
  });
});





  
  


module.exports = router; 