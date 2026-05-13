import express from 'express'
import authMiddleware from "../middleware/authMiddleware.js"

import { getAllOrders, placeOrder, verifyOrder, getOrderById, UserOrders, getAvailableOrders, bookOrder, updateStatus, getDeliveryOrders, rateOrder, getOrdersByDeliveryBoy } from '../controllers/OrderController.js'

const orderRouter = express.Router();
orderRouter.post("/place",authMiddleware, placeOrder)
orderRouter.get("/all",getAllOrders)
orderRouter.post("/verify",verifyOrder)
orderRouter.post("/rate",authMiddleware,rateOrder)
orderRouter.get("/orderdetails/:orderId",authMiddleware,getOrderById)
orderRouter.get("/myorders",authMiddleware,UserOrders)

// Delivery routes
orderRouter.get("/available", authMiddleware, getAvailableOrders)
orderRouter.post("/book", authMiddleware, bookOrder)
orderRouter.post("/status", authMiddleware, updateStatus)
orderRouter.get("/delivery-orders", authMiddleware, getDeliveryOrders)

// Admin: get orders by delivery boy
orderRouter.get("/by-delivery-boy/:deliveryBoyId", getOrdersByDeliveryBoy)
orderRouter.get("/test", (req, res) => res.json({ success: true, message: "Order route is active" }))

export default orderRouter;