import orderModel from "../models/orderModel.js";

// GET SINGLE ORDER
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

    // Security: only owner can see the order
    if (order.orderId.toString() !== req.orderId) {
      return res.json({
        success: false,
        message: "Unauthorized access"
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error fetching order"
    });
  }
};

export { getOrderById };
