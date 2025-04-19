const mongoose=require("mongoose")
const dotenv=require("dotenv")
const Product=require("./models/Product")
const User=require("./models/User")
const products=require("./data/Product")
const Cart = require("./models/Cart")
dotenv.config()
mongoose.connect(process.env.MONGO_URI)
const seeddata=async ()=>{
    try{
        await Product.deleteMany()
        await User.deleteMany()
        await Cart.deleteMany()

        const createdUser=await User.create({
            name:"Admin User",
            email:"admin@example.com",
            password:"123456",
            role:"admin"
        });
        const userId=createdUser._id;

        const sampleProducts=products.map(product=>{
            return {...product,user:userId};
        });
        await Product.insertMany(sampleProducts)
        console.log("Data seeded");
        process.exit()

    }catch(error){
        console.log(error.message)
        process.exit(1)

    };  
}
seeddata();
