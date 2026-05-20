import DonationModel from "../models/DonationModel.js";
import orderModel from "../models/orderModel.js";
import UserModel from "../models/UserModel.js";

export const getStats = async (req, res) => {
  try {
    const donationsCount = await DonationModel.countDocuments();
    const ordersCount = await orderModel.countDocuments();
    // Delivery boys
    const deliveryBoysCount = await UserModel.countDocuments({ role: 'delivery_boy' });
    
    // Donors and receivers
    const donorsCount = await UserModel.countDocuments({ role: 'donor' });
    const receiversCount = await UserModel.countDocuments({ role: 'receiver' });

    res.status(200).json({
      success: true,
      data: {
        donations: donationsCount,
        receivers: ordersCount,
        communities: deliveryBoysCount,
        donors: donorsCount,
        receiversCount: receiversCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: error.message,
    });
  }
};

