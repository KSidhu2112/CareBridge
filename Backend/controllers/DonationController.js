import DonationModel from "../models/DonationModel.js";
import fs from "fs";

export const createDonation = async (req, res) => {
  try {
    // ✅ Store only the filename (not full path)
    const donation = new DonationModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.file.filename,
      donorId: req.body.donorId || null
    });

    const savedDonation = await donation.save();

    res.status(201).json({
      success: true,
      message: "Donation created successfully",
      data: savedDonation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create donation",
      error: error.message,
    });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const donations = await DonationModel.find({});
    res.status(200).json({ success: true, data: donations });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDonationsByDonor = async (req, res) => {
  try {
    const { donorId } = req.params;
    const donations = await DonationModel.find({ donorId }).sort({ _id: -1 });
    res.status(200).json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch donor donations", error: error.message });
  }
};

export const deleteDonation = async (req, res) => {
  try {
    const donation = await DonationModel.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // ✅ Delete image if it exists
    if (donation.image) {
      const imagePath = `uploads/${donation.image}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await DonationModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Donation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

