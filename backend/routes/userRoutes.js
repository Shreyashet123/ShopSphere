const express=require('express');
const User=require('../models/User')
const jwt=require('jsonwebtoken');
const { protect } = require('../middleware/authmiddleware');

const router=express.Router();

router.post('/register',async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({error:"User already exists"});
        }
        user=new User({name,email,password});
        await user.save();
       
        const payload={user:{id:user._id,role:user.role}};
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token)=>{
            if(err) throw err;
            res.status(200).json({
                user:{
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role
                },
                token
            });
        })
    }catch(error){
        console.log(error);
        res.status(400).json({error:error.message});
    }
});
router.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"User does not exists"});
        }
        const isMatch=await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({error:"Invalid credentials"});
    }
    const payload={user:{id:user._id,role:user.role}};
    jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token)=>{
        if(err) throw err;
        res.json({
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            },
            token
        });
    })
}catch(error){
    console.log(error);
    res.status(400).json({error:error.message});     
    }
})

router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
});

module.exports=router;