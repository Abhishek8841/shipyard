import express, { Request, Response } from "express";
import dotenv from "dotenv";
import urlRouter from "./routes/url.routes";
import authRouter from "./routes/auth.routes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", urlRouter);
app.use("/api/v1", authRouter);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.originalUrl} [shipyard]`
    });
});

app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error... Caught in global error middleware @index.ts"
    });
});

export default app;