import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type: String,
        default: 'user'
    },
    phone: {
        type: String,
        default: ""
    },
    cart:{
        type:Object,
        default:{}
    },
    totalRating: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    }
},{minimize:false});

const UserModel=mongoose.models.user || mongoose.model("user",userSchema);

export default UserModel;