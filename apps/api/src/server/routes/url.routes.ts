import express from "express";
import { authMiddleWare } from "../middleware/auth.middleware.js";
import { uploadToQueue } from "../controller/url.controller.js";
const urlRouter = express.Router();

urlRouter.post("/upload", authMiddleWare, uploadToQueue);

export default urlRouter;