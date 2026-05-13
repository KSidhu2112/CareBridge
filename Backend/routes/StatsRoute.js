import express from "express";
import { getStats } from "../controllers/StatsController.js";

const statsRouter = express.Router();

statsRouter.get("/", getStats);

export default statsRouter;
