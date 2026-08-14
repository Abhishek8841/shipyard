import express from "express";
import { authMiddleWare } from "../middleware/auth.middleware.js";
import { uploadToQueue } from "../controller/url.controller.js";
import { numberOfBuildsMetrics } from "../middleware/metrics.middleware.js";
const urlRouter = express.Router();

urlRouter.post("/upload", authMiddleWare, numberOfBuildsMetrics, uploadToQueue);

export default urlRouter;