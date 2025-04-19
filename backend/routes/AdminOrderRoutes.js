const express=require('express')

const Order=require("../models/Order");
const { protect, admin } = require('../middleware/authmiddleware');

const router=express.Router();
router.get("/", protect, admin, async (req, res) => {
    try {
      // Get all orders with populated users
      const orders = await Order.find({})
        .populate({
          path: 'user',
          select: 'name email',
          model: 'User'
        })
        .lean();
  
      // Filter out orders where user doesn't exist (null or undefined)
      const validOrders = orders.filter(order => order.user !== null && order.user !== undefined);
  
      console.log(`Returning ${validOrders.length} orders with valid users (filtered from ${orders.length} total orders)`);
  
      return res.json(validOrders);
  
    } catch(error) {
      console.error("Error fetching orders:", error.message);
      return res.status(500).json({
        message: "Failed to fetch orders",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
router.put("/:id",protect,admin,async(req,res)=>{
    try{
        const order=await Order.findById(req.params.id).populate("user","name email")
        if(order){
            order.status=req.body.status||order.status;
            order.isDelivered=req.body.status ==="Delivered"?true:order.isDelivered;
            order.deliveredAt=req.body.status ==="Delivered"?Date.now():order.deliveredAt;
            const updatedOrder = await order.save();
return res.status(200).json(updatedOrder); // ✅ correct

        }else{
            return res.status(400).json({message:"Order not found"})
        }
       
}catch(error){
    console.error(error.message)
    res.status(500).json({message:error.message})
}
})

router.delete("/:id",protect,admin,async(req,res)=>{
    try{
        const order=await Order.findById(req.params.id)
        if(order){
            await order.deleteOne()
            return res.status(200).json({message:"Order deleted"})
        }else{
            return res.status(400).json({message:"Order not found"})
        }

}catch(error){
    console.error(error.message)
    res.status(500).json({message:error.message})
}
})



module.exports=router;