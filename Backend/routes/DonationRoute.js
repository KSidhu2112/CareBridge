import express from "express";
import multer from "multer";
import { createDonation, deleteDonation, getAllDonations, getDonationsByDonor } from "../controllers/DonationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkRole from "../middleware/roleMiddleware.js";

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
Donationrouter.post("/create", authMiddleware, checkRole(["donor"]), upload.single('image'), createDonation);
Donationrouter.get("/getAll", getAllDonations);
Donationrouter.get("/donor/:donorId", getDonationsByDonor);
Donationrouter.delete("/delete/:id", authMiddleware, checkRole(["donor"]), deleteDonation);

export default Donationrouter;

