import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import orderModel from './models/orderModel.js';
import cors from 'cors';
import connectDB from './config/db.js';
import Donationrouter from './routes/DonationRoute.js';
import Userrouter from './routes/UserRoute.js';
import cartRouter from './routes/CartRoute.js';
import orderRouter from './routes/OrderRoute.js';
import statsRouter from './routes/StatsRoute.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

// Serve uploaded images
app.use('/images', express.static('uploads'));

// API routes
app.use('/api/donation', Donationrouter);
app.use('/api/user',Userrouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);
app.use("/api/stats", statsRouter);

// Direct fix for Delivery Boy Orders is already handled in UserRoute.js

app.listen(port, () => {
  console.log(`✅ Server is running on port: ${port}`);
});

process.on('uncaughtException', (err) => {
    console.error('🔥 UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 UNHANDLED REJECTION:', reason);
});
