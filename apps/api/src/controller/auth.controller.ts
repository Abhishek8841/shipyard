import type { Request, Response } from "express";
import { signinSchema, signupSchema } from "../schema/auth.schema.js";
import { signupService, signinService, meService } from "../services/auth.services.js";
import { idSchema } from "../schema/auth.schema.js";


export const signup = async (req: Request, res: Response) => {
    try {
        const result = signupSchema.safeParse(req.body);
        if (!result.success) return res.status(400).json({
            success: false,
            message: "Wrong inputs"
        })
        const signupPayload = result.data;
        const { user, token } = await signupService(signupPayload);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            secure: process.env.NODE_ENV === "production"
        })
        return res.status(200).json({
            success: true,
            message: "Created account successfully",
            user
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        })
    }
}

export const signin = async (req: Request, res: Response) => {
    try {
        const result = signinSchema.safeParse(req.body);
        if (!result.success) return res.status(400).json({
            success: false,
            message: "Wrong inputs"
        })
        const signinPayload = result.data;
        const { alreadyExist, token } = await signinService(signinPayload);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            secure: process.env.NODE_ENV === "production"
        })
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: alreadyExist
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        })
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            secure: process.env.NODE_ENV === "production"
        });
        return res.status(200).json(
            {
                success: true,
                message: "User logged out successfully",
            }
        );
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        })
    }
}

export const me = async (req: Request, res: Response) => {
    try {
        const result = idSchema.safeParse(req.id);
        if (!result.success) return res.status(400).json({
            success: false,
            message: "Wrong inputs"
        })
        const id = result.data;
        const user = await meService(id);

        return res.status(200).json(
            {
                success: true,
                message: "User details fetched successfully",
                user
            }
        );
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        })
    }
} 