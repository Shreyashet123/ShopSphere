const express=require('express');
const cors =require('cors');
const  dotenv=require('dotenv');
dotenv.config();
const connectDB=require('./config/db')
const userRoutes=require('./routes/userRoutes')
const productRoutes=require('./routes/productRoutes')
const cartRoutes=require('./routes/Cartroutes');
const checkoutRoutes=require('./routes/CheckoutRoutes');
const orderRoutes=require('./routes/OrderRoutes');
const uploadRoutes=require('./routes/uploadRoute');
const adminRoutes=require('./routes/adminroutes');
const productAdminRoutes=require('./routes/productadminroutes');
const OrderAdminRoutes=require('./routes/AdminOrderRoutes');
const reviewRoutes=require('./routes/adminreviewroutes');
const { default: Stripe } = require('stripe');


const app=express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // Optional: allow sending cookies or Authorization headers
  }));

app.use(express.json());

const PORT = process.env.PORT || 3000;

connectDB();
app.get('/',(req,res)=>{
    res.send("hello world");
})

app.use('/api/users',userRoutes);
app.use('/api/products',productRoutes);
app.use('/api/carts',cartRoutes);
app.use('/api/checkout',checkoutRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/upload',uploadRoutes);
app.use('/api/admin/users',adminRoutes);
app.use('/api/admin/products',productAdminRoutes);
app.use('/api/admin/orders',OrderAdminRoutes);
app.use('/api/admin/reviews',reviewRoutes)
app.use('/api/payment', Stripe);
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})