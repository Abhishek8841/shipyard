import express, { Request, Response } from "express";
import dotenv from "dotenv";
import urlRouter from "./routes/url.routes";
import authRouter from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import deploymentRouter from "./routes/deployment.routes";
import cors from "cors"
import { register } from "@shipyard/metrics";
import { metricsMiddleware } from "./middleware/metrics.middleware";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:4000", "https://shipyard.abatra.me"];
app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) cb(null, true);
        else cb(new Error("Not allowed by cors"))
    },
    credentials: true,
}));


app.get("/metrics", async (req: Request, res: Response) => {
    res.set(
        "Content-Type",
        register.contentType
    );
    res.end(
        await register.metrics()
    );
})

app.use(metricsMiddleware);

app.use("/api/v1", urlRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1", deploymentRouter);

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