
export const getDeliveryBoys = async (req, res) => {
    try {
        const deliveryBoys = await UserModel.find({ role: 'delivery_boy' }).select('-password -plainPassword');
        res.json({ success: true, deliveryBoys });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching delivery boys" });
    }
}
