import client from "prom-client";

export const apiRegister = new client.Registry();

// api
export const httpRequestCounter =
    new client.Counter({
        name: "http_requests_total",
        help: "Total HTTP requests",
        labelNames: ["method", "route", "status"],
        registers: [apiRegister]
    });

// api
export const deploymentCounter =
    new client.Counter({
        name: "deployments_created_total",
        help: "Total deployments created",
        registers: [apiRegister]
    });