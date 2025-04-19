const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authmiddleware");
const router = express.Router();

const getCart = async (userId, guestId) => {
    console.log("Checking cart for:", { userId, guestId });

    let cart = null;

    if (userId) {
        cart = await Cart.findOne({ user: userId }); // FIXED: Using "user" instead of "userId"
    } else if (guestId) {
        cart = await Cart.findOne({ guestId }); 
    }

    console.log("Cart found:", cart);
    return cart;
};



router.post("/", async (req, res) => {
    try {
        const { productId, quantity, size, color, guestId, userId } = req.body;
        const validQuantity = Number(quantity) > 0 ? Number(quantity) : 1;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Fetch cart
        let cart = await getCart(userId, guestId);

        if (cart) {
            // Check if product already exists in cart
            const productIndex = cart.products.findIndex(
                (p) => p.productId.toString() === productId && p.size === size && p.color === color
            );

            if (productIndex !== -1) {
                // Increase quantity
                cart.products[productIndex].quantity += validQuantity;
            } else {
                // Add new product to cart
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0]?.url || "",
                    price: Number(product.price) || 0,
                    size,
                    color,
                    quantity: validQuantity
                });
            }
        } else {
            // Create a new cart
            cart = await Cart.create({
                user: userId || undefined,
                guestId: guestId || `guest_${Date.now()}`,
                products: [{
                    productId,
                    name: product.name,
                    image: product.images[0]?.url || "",
                    price: Number(product.price) || 0,
                    size,
                    color,
                    quantity: validQuantity
                }],
                totalPrice: Number(product.price) * validQuantity
            });
        }

        // Update total price
        cart.totalPrice = cart.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
        await cart.save();

        return res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
});

//update product quantity in the cart for a guest or loggd in user
router.put("/", async (req, res) => {
    try {
        const { productId, quantity, size, color, guestId, userId } = req.body;
        const validQuantity = Number(quantity);

        if (isNaN(validQuantity) || validQuantity < 0) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        let cart = await getCart(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the product in cart
        const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId && p.size === size && p.color === color
        );

        if (productIndex > -1) {
            if (validQuantity > 0) {
                cart.products[productIndex].quantity = validQuantity;
            } else {
                cart.products.splice(productIndex, 1); // Remove if quantity is 0
            }

            // Update total price
            cart.totalPrice = cart.products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
            await cart.save();

            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
});

router.delete("/",async(req,res)=>{
    const {productId,size,color,guestId,userId} = req.body;
    try {
        let cart =await getCart(userId,guestId);
        if(!cart){
            return res.status(404).json({ message: "Cart not found" });
        }
        const productIndex = cart.products.findIndex((p)=>p.productId.toString() === productId && p.size === size && p.color === color);
        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
            cart.totalPrice = cart.products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
            await cart.save();
            return res.status(200).json(cart);
        }else{
            return res.status(404).json({ message: "Product not found in cart" });
        }

    }catch(error){
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
})
//get logged in users cart

router.get("/",async(req,res)=>{
    const {userId,guestId} = req.query;
    try {
        const cart = await getCart(userId,guestId);
        if(!cart){
            return res.status(404).json({ message: "Cart not found" });
        }else{
            return res.status(200).json(cart);
        }

    }catch(error){
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
    
})

//merge the guest cart with logged in user cart

router.post("/merge",protect,async(req,res)=>{
    const {guestId}=req.body;
    try{
        const guestCart=await Cart.findOne({guestId});
        const userCart=await Cart.findOne({user:req.user._id});
        if(guestCart){
           if(guestCart.products.length ===0){
                return res.status(404).json({ message: "Guest cart is empty" });
           }
           if(userCart){
            guestCart.products.forEach((guestItem)=>{
                const productIndex=userCart.products.findIndex((item)=>item.productId.toString()===guestItem.productId.toString() &&
                item.size ===guestItem.size && item.color ===guestItem.color);
                if(productIndex>-1){
                    userCart.products[productIndex].quantity+=guestItem.quantity;
                }else{
                    userCart.products.push(guestItem);
                }
            });
            userCart.totalPrice=userCart.products.reduce((total,item)=>total+item.price*item.quantity,0);
            await userCart.save();

            try{
                await Cart.findOneAndDelete({guestId});

            }catch(error){
                console.error(error);
                return res.status(500).json({ message: error.message });
            }
            res.status(200).json(userCart);
           }else{
               guestCart.user=req.user._id;
               guestCart.guestId=undefined;
               await guestCart.save();
               res.status(200).json(guestCart);
           }
        }else{
            if(userCart){
                return res.status(200).json(userCart);
            }
            res.status(404).json({ message: "Guest Cart not found" });
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
    
})


module.exports = router;
