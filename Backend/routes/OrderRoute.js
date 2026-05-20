import express from 'express'
import authMiddleware from "../middleware/authMiddleware.js"
import checkRole from "../middleware/roleMiddleware.js"

import { getAllOrders, placeOrder, verifyOrder, getOrderById, UserOrders, getAvailableOrders, bookOrder, updateStatus, getDeliveryOrders, rateOrder, getOrdersByDeliveryBoy, getOrdersByUser } from '../controllers/OrderController.js'

const orderRouter = express.Router();
orderRouter.post("/place",authMiddleware, checkRole(["receiver"]), placeOrder)
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
// Admin: get orders by user/receiver
orderRouter.get("/by-user/:userId", getOrdersByUser)
orderRouter.get("/test", (req, res) => res.json({ success: true, message: "Order route is active" }))

export default orderRouter;