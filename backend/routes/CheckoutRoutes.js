const express=require('express')
const Checkout=require("../models/Checkout")
const Cart=require("../models/Cart")
const Product=require("../models/Product")
const Order=require("../models/Order")
const { protect } = require('../middleware/authmiddleware')
const router=express.Router();

router.post("/", protect, async (req, res) => {
    try {
        const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

        console.log("Checkout API called with:", req.body);

        if (!checkoutItems || checkoutItems.length === 0) {
            return res.status(400).json({ message: "No items in the cart" });
        }

        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "pending",
            isPaid: false,
        });

        console.log(`Checkout created for user: ${req.user._id}`);
        return res.status(201).json(newCheckout);

    } catch (error) {
        console.error(" Error creating checkout:", error);

        // Prevent multiple responses
        if (!res.headersSent) {
            return res.status(500).json({ message: error.message });
        }
    }
});

router.put("/:id/pay",protect,async(req,res)=>{
    const{paymentStatus,paymentDetails}=req.body;
    try{
        const checkout=await Checkout.findById(req.params.id);
        if(!checkout){
            return res.status(404).json({message:"Checkout not found"})
        }
        if(paymentStatus==="paid"){
            checkout.isPaid=true;
            checkout.paymentStatus=paymentStatus;
            checkout.paymentDetails=paymentDetails;
            checkout.paidAt=Date.now();
            await checkout.save();

            res.status(200).json(checkout);
        }else{
            res.status(400).json({message:"Payment status is not paid"})
        }

    }catch(error){
        console.error("Error updating checkout",error); 
        res.status(500).json({message:error.message});
    } 
})

router.post("/:id/finalize",protect,async(req,res)=>{
    try{
        const checkout=await Checkout.findById(req.params.id);
        if(!checkout){
            return res.status(404).json({message:"Checkout not found"})
        }
        if(checkout.isPaid && !checkout.isFinalized){
            const finalOrder=await Order.create({
                user:checkout.user,
                orderItems:checkout.checkoutItems,
                shippingAddress:checkout.shippingAddress,
                paymentMethod:checkout.paymentMethod,
                totalPrice:checkout.totalPrice,
                isPaid:true,
                paidAt:checkout.paidAt,
                isDelivered:false,
               paymentStatus:"paid",
               paymentDetails:checkout.paymentDetails,
            });
            checkout.isFinalized=true;
            checkout.finalizedAt=Date.now();
            await checkout.save();

            await Cart.findOneAndDelete({user:checkout.user});
            res.status(200).json(finalOrder); 
        }else if(checkout.isFinalized){
            res.status(400).json({message:"Checkout already finalized"})
        }else{
            res.status(400).json({message:"Checkout not paid"})
        }

    }catch(error){
        console.error(error)
        res.status(500).json({message:error.message})

    } 
});

module.exports=router;
