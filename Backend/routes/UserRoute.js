import {loginUser, registerUser, getProfile, getDeliveryBoys, sendOtp, getDonors, getReceivers} from "../controllers/UserController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const Userrouter = express.Router();

// Routes
Userrouter.post("/register", registerUser);
Userrouter.post("/send-otp", sendOtp);
Userrouter.post("/login", loginUser);
Userrouter.get("/get-profile", authMiddleware, getProfile);
Userrouter.get("/delivery-boys", getDeliveryBoys);
Userrouter.get("/donors", getDonors);
Userrouter.get("/receivers", getReceivers);

Userrouter.get("/check", (req, res) => res.json({ success: true, message: "User route is updated" }));


export default Userrouter;