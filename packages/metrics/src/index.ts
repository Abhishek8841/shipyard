import client from "prom-client";

export const register = new client.Registry();

client.collectDefaultMetrics({ register });

// api
export const httpRequestCounter =
    new client.Counter({
        name: "http_requests_total",
        help: "Total HTTP requests",
        labelNames: ["method", "route", "status"],
        registers: [register]
    });

// api
export const deploymentCounter =
    new client.Counter({
        name: "deployments_created_total",
        help: "Total deployments created",
        registers: [register]
    });

// builder
export const deploymentsFailed =
    new client.Counter({
        name: "deployments_failed_total",
        help: "Total deployments failed",
        registers: [register]
    })

// builder
export const deploymentsCompleted =
    new client.Counter({
        name: "deployments_completed_total",
        help: "Total deployments completed",
        registers: [register]
    })

// builder
export const activeJobs =
    new client.Gauge({
        name: "active_build_jobs",
        help: "Currently active builds",
        registers: [register]
    });

// builder
export const buildDuration =
    new client.Histogram({
        name: "build_duration_seconds",
        help: "Deployment build time",
        buckets: [60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 1000],
        registers: [register]
    });

// idk?
export const deploymentQueueDuration =
    new client.Histogram({
        name: "deployment_queue_duration_seconds",
        help: "Time spent waiting in deployment queue",
        registers: [register],
        buckets: [1, 5, 10, 30, 60, 120]
    });

// builder
export const dockerBuildErrors =
    new client.Counter({
        name: "docker_build_errors_total",
        help: "Total docker build failures",
        registers: [register]
    });