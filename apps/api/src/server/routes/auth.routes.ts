import express from "express";
import { authMiddleWare } from "../middleware/auth.middleware.js";
import { logout, me, signin, signup } from "../controller/auth.controller.js";
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/logout", authMiddleWare, logout);
authRouter.get("/me", authMiddleWare, me);

export default authRouter;