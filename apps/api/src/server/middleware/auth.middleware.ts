import type { NextFunction, Request, Response } from "express";
import { authMiddleWareService } from "../services/auth.services.js";

export const authMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log("Path:", req.path);
        // console.log("Cookie:", req.headers.cookie);
        const token = req.cookies.token;
        if (!token) throw new Error("Invalid request");
        const payload = authMiddleWareService(token);
        req.id = payload.id;
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error"
        })
    }
}