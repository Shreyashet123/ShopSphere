const jwt = require('jsonwebtoken');
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            console.log("Received Token:", token); // Debugging

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Data:", decoded); // Debugging

            req.user = await User.findById(decoded.user.id).select("-password");
            if (!req.user) {
                return res.status(401).json({ success: false, message: "User not found" });
            }

            next();
        } catch (error) {
            console.log("JWT Error:", error.message);
            return res.status(401).json({ success: false, message: "Invalid Token" });
        }
    } else {
        return res.status(401).json({ success: false, message: "No token provided" });
    }
};
const admin=(req,res,next)=>{
    if(req.user && req.user.role ==='admin'){
        next();
    }else{
        res.status(401).json({success:false,message:'Not authorized as admin'})
    }
}

module.exports = { protect,admin };
