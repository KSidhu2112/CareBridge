import UserModel from "../models/UserModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await UserModel.findById(req.userId);
        let cartData = userData.cart;
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        await UserModel.findByIdAndUpdate(req.userId, { cart: cartData });
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await UserModel.findById(req.userId);
        let cartData = userData.cart;
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        await UserModel.findByIdAndUpdate(req.userId, { cart: cartData });
        res.json({ success: true, message: "Removed From Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Get user cart data
const getCart = async (req, res) => {
    try {
        let userData = await UserModel.findById(req.userId);
        let cartData = userData.cart;
        res.json({ success: true, cart: cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { addToCart, removeFromCart, getCart };
