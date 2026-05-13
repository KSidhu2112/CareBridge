import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 300 } // OTP expires after 5 minutes
    }
});

const OtpModel = mongoose.models.otp || mongoose.model("otp", otpSchema);

export default OtpModel;
