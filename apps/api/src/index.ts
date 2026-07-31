import express, { Request, Response } from "express";
const app = express();

app.use(express.json());

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

app.listen(3000, () => { console.log("server is live") });