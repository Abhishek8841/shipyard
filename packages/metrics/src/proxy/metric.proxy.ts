import client from "prom-client";

export const proxyRegister = new client.Registry();


// proxy
export const proxyRequestCounter = new client.Counter({
    name: "proxy_request_counter_total",
    help: "Counts the total requests to proxy",
    labelNames: ["status"],
    registers: [proxyRegister]
})

// proxy
export const proxyDuration = new client.Histogram({
    name: "time_to_serve_deployments",
    help: "Time taken to serve the deployments",
    buckets: [1, 5, 10, 50, 100, 250, 500],
    registers: [proxyRegister]
})