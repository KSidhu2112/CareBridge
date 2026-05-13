import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    userId:{
        type:String,required:true
    },
    items:{
        type:Array,required:true
    },
    address:{
        type:Object,required:true
    },
    status:{
        type:String,default:"Placed"
    },
    amount: {
        type: Number, default: 0
    },
    deliveryPerson: {
        type: String, default: null
    },
    date:{
        type:Date,default:Date.now
    },
    rating: {
        type: Number,
        default: null
    }
})

const orderModel=mongoose.models.order || mongoose.model("order",orderSchema)

export default orderModel