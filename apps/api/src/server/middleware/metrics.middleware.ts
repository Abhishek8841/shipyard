import { deploymentCounter, httpRequestCounter } from "@shipyard/metrics";
import { NextFunction, Request, Response } from "express";

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.path == "/metrics") return next();
    res.on("finish", () => {
        httpRequestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status: String(res.statusCode),
        })
    });
    next();
}

export const numberOfBuildsMetrics = (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", () => {
        deploymentCounter.inc();
    })
    next();
}