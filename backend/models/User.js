const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:[6,"Password must be at least 6 characters long"],
    },
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer"
    },
},{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
});

userSchema.methods.matchPassword=async function(password){
    return await bcrypt.compare(password,this.password);
}
module.exports=mongoose.model("User",userSchema);