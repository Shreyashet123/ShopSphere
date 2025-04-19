const express=require('express')

const Order=require("../models/Order");
const { protect } = require('../middleware/authmiddleware');

const router=express.Router();
router.get("/my-orders",protect,async(req,res)=>{
    try{
        const orders=await Order.find({user:req.user._id}).sort({createdAt:-1})
        res.status(200).json(orders)

    }catch(error){
        res.status(500).json({message:error.message})
    }
});

router.get("/:id",protect,async(req,res)=>{
    try{
        const order=await Order.findById(req.params.id).populate("user","name email")
        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        res.json(order)

    }catch(error){
        console.log(error)
        res.status(500).json({message:error.message})
    }
})
module.exports=router;