const express=require('express')
const User=require("../models/User");
const { protect, admin } = require('../middleware/authmiddleware');

const router=express.Router();

router.get("/",protect,admin,async(req,res)=>{
    try{
        const users=await User.find({});
         return res.json(users)

    }catch(error){
        console.error(error.message)
        res.status(500).json({message:error.message})
        
    }
})

router.post("/",protect,admin,async(req,res)=>{
    const {name,email,password,role}=req.body;
    try{
        let user=await User.findOne({email});
        if(user){
            return res.status(200).json({message:"User already exists"})
        }
      user=new User({
        name,
        email,
        password,
        role:role||"customer"
    });
    await user.save();
    res.status(201).json(user); // instead of { message, user }

    }catch(error){
        console.error(error.message)
        res.status(500).json({message:error.message})

    }
})
router.put("/:id",protect,admin,async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(user){
            user.name=req.body.name||user.name;
            user.email=req.body.email||user.email;
            user.role=req.body.role||user.role;
            await user.save();  // Save the updated user
            res.status(200).json(user); // Return the updated user
          } else {
            res.status(404).json({ message: "User not found" });
          }

    }catch(error){
        console.error(error.message)
        res.status(500).json({message:error.message})

    }
})
router.delete("/:id",protect,admin,async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(user){
            await user.deleteOne();
            res.status(200).json({message:"User deleted successfully"})
        }else{
            res.status(404).json({message:"User not found"})
        }
    }catch(error){
        console.error(error.message)
        res.status(500).json({message:error.message})
         
    }
})
module.exports=router;