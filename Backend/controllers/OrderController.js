import orderModel from "../models/orderModel.js";
import UserModel from "../models/UserModel.js";



// PLACE ORDER
const placeOrder = async (req, res) => {
  try {
    if (!req.body.items || req.body.items.length === 0) {
        return res.json({ success: false, message: "Cart is empty" });
    }

    const newOrder = new orderModel({
      userId: req.userId,
      items: req.body.items,
      address: req.body.address,
      status: "Placed",
      amount: 2 // Hardcoded delivery fee
    });

    await newOrder.save();

    await UserModel.findByIdAndUpdate(req.userId, {
      cart: {}
    });

    res.json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
      orderId: newOrder._id
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: `Error placing order: ${error.message}` });
  }
};

const getAvailableOrders = async (req, res) => {
    try {
        // Query for any order not yet assigned, and exclude orders placed by the delivery person themselves
        const orders = await orderModel.find({ 
            status: "Placed",
            deliveryPerson: { $in: [null, undefined, ""] },
            userId: { $ne: req.userId }
        }).sort({ date: -1 });
        
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to fetch available orders" });
    }
};

// GET DELIVERY PERSON'S ORDERS
const getDeliveryOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({
            deliveryPerson: req.userId
        }).sort({ date: -1 });
        
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to fetch delivery orders" });
    }
};

// BOOK ORDER
const bookOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await orderModel.findById(orderId);

        if (!order) return res.json({ success: false, message: "Order not found" });
        if (order.deliveryPerson) return res.json({ success: false, message: "Already booked" });

        await orderModel.findByIdAndUpdate(orderId, {
            deliveryPerson: req.userId,
            status: "Assigned"
        });

        res.json({ success: true, message: "Order booked successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to book order" });
    }
};

// UPDATE STATUS
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to update status" });
    }
};


const UserOrders = async (req, res) => {
  try {

    const orders = await orderModel.find({
      userId: req.userId
    }).sort({ date: -1 });

    // Populate delivery person details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const orderObj = order.toObject ? order.toObject() : order;
        if (orderObj.deliveryPerson) {
          const deliveryBoy = await UserModel.findById(orderObj.deliveryPerson)
            .select("name averageRating ratingCount");
          if (deliveryBoy) {
            orderObj.deliveryBoyDetails = deliveryBoy;
          }
        }
        return orderObj;
      })
    );

    res.json({
      success: true,
      orders: ordersWithDetails
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};






const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find().sort({ date: -1 });

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to fetch orders" });
    }
};



const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found"
      });
    }

    // ✅ correct ownership check
    if (order.userId.toString() !== req.userId) {
      return res.json({
        success: false,
        message: "Unauthorized access"
      });
    }

    const orderObj = order.toObject ? order.toObject() : order;
    if (orderObj.deliveryPerson) {
        const deliveryBoy = await UserModel.findById(orderObj.deliveryPerson).select("name averageRating");
        if (deliveryBoy) {
            orderObj.deliveryBoyDetails = deliveryBoy;
        }
    }

    res.json({
      success: true,
      order: orderObj
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error fetching order"
    });
  }
};




const verifyOrder = async (req, res) => {
    try {
        const { orderId, confirm } = req.body;

        if (confirm) {
            await orderModel.findByIdAndUpdate(orderId, {
                status: "Received"
            });

            res.json({
                success: true,
                message: "Order marked as received"
            });
        } else {
            await orderModel.findByIdAndUpdate(orderId, {
                status: "Cancelled"
            });

            res.json({
                success: true,
                message: "Order cancelled"
            });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Order verification failed" });
    }
};

const rateOrder = async (req, res) => {
    try {
        const { orderId, rating } = req.body;
        
        const order = await orderModel.findById(orderId);
        if (!order) return res.json({ success: false, message: "Order not found" });
        if (order.rating) return res.json({ success: false, message: "Already rated" });
        
        // Update order with rating
        order.rating = rating;
        await order.save();
        
        // Update delivery person's average rating if assigned
        if (order.deliveryPerson) {
            const deliveryPerson = await UserModel.findById(order.deliveryPerson);
            if (deliveryPerson) {
                deliveryPerson.totalRating = (deliveryPerson.totalRating || 0) + rating;
                deliveryPerson.ratingCount = (deliveryPerson.ratingCount || 0) + 1;
                deliveryPerson.averageRating = deliveryPerson.totalRating / deliveryPerson.ratingCount;
                await deliveryPerson.save();
            }
        }
        
        res.json({ success: true, message: "Rating submitted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to submit rating" });
    }
};




// GET ALL ORDERS FOR A SPECIFIC DELIVERY BOY (Admin)
const getOrdersByDeliveryBoy = async (req, res) => {
    try {
        const { deliveryBoyId } = req.params;

        const orders = await orderModel.find({
            deliveryPerson: deliveryBoyId
        }).sort({ date: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to fetch delivery boy orders" });
    }
};

export { placeOrder, getAllOrders, verifyOrder, getOrderById, UserOrders, getAvailableOrders, bookOrder, updateStatus, getDeliveryOrders, rateOrder, getOrdersByDeliveryBoy };
