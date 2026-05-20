import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
    ,
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    donorId:{
        type:String,
        default:null
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "Pending"
    }
})

const DonationModel = mongoose.models.donation || mongoose.model("donation",DonationSchema);

export default DonationModel;