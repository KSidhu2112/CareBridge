import express from "express";
import multer from "multer";
import { createDonation, deleteDonation, getAllDonations } from "../controllers/DonationController.js";

const Donationrouter = express.Router();

// Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
Donationrouter.post("/create", upload.single('image'), createDonation);
Donationrouter.get("/getAll", getAllDonations);
Donationrouter.delete("/delete/:id", deleteDonation);

export default Donationrouter;
