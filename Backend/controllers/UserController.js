import UserModel from "../models/UserModel.js";
import orderModel from "../models/orderModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
import bcrypt from "bcryptjs";
import OtpModel from "../models/OtpModel.js";
import { sendOtpEmail } from "../services/emailService.js";

dotenv.config();

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
}

export const loginUser = async (req, res) => {
    let { email, password } = req.body;
    if (email) email = email.toLowerCase();
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email " });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }
        const token = createToken(user._id);
        return res.json({ success: true, token, role: user.role });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

export const registerUser = async (req, res) => {
    let { name, email, password, otp, role, phone } = req.body;
    if (email) email = email.toLowerCase();
    console.log("Register attempt body:", { ...req.body, email });

    try {
        // Validation
        if (!name || !email || !password || !otp) {
            console.log("Validation failed: Missing fields", { name:!!name, email:!!email, password:!!password, otp:!!otp });
            return res.status(400).json({ success: false, message: "Please fill all the fields including OTP" });
        }
        if (!validator.isEmail(email)) {
            console.log("Validation failed: Invalid email", email);
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            console.log("Validation failed: User already exists", email);
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Verify OTP
        const otpRecord = await OtpModel.findOne({ email, otp });
        if (!otpRecord) {
            console.log("Validation failed: Invalid or expired OTP", { email, otp });
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            phone: phone || ''
        });
        await newUser.save();

        // Delete OTP record after successful registration
        await OtpModel.deleteOne({ email, otp });

        const token = createToken(newUser._id);
        return res.json({ success: true, token, role: newUser.role });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const sendOtp = async (req, res) => {
    let { email } = req.body;
    if (email) email = email.toLowerCase();
    try {
        console.log("sendOtp request for:", email);
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please provide a valid email" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save to DB
        await OtpModel.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        console.log(`Generated OTP: ${otp} for ${email}`);

        // Try to send email
        const emailResponse = await sendOtpEmail(email, otp);
        
        if (emailResponse.success) {
            return res.json({ success: true, message: "OTP sent successfully" });
        } else {
            console.error("Email sending failed:", emailResponse.error);
            return res.status(500).json({ 
                success: false, 
                message: "Failed to send OTP to email. Please try again later."
            });
        }
    } catch (error) {
        console.error("CRITICAL ERROR in sendOtp:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


export const getProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("-password");
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to fetch profile" });
    }
};

export const getDeliveryBoys = async (req, res) => {
    try {
        const deliveryBoys = await UserModel.find({ role: 'delivery_boy' }).select('-password');
        res.json({ success: true, deliveryBoys });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching delivery boys" });
    }
};
