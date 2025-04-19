const express=require('express')

const Product=require("../models/Product");
const { protect, admin } = require('../middleware/authmiddleware');

const router=express.Router();
router.get("/",protect,admin,async(req,res)=>{
    try{
        const products=await Product.find({});
        res.json(products);
    }catch(err){
        console.error(err);
        res.json({message:err.message});
    }
    
})
router.post('/',protect,admin,async(req,res)=>{
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
        console.log("CREATE PRODUCT BODY:", req.body);
        const product=new Product({
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
            sku,
            user:req.user._id
        })
        const createdProduct=await product.save();
        res.status(201).json(createdProduct);
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Internal Server Error"})
        
    }
})


module.exports=router;