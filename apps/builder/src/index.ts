import { redis_class } from "@shipyard/redis"
import { Worker } from "bullmq"
import { uploader } from "./processor/uploader.processor";
import "./metric.server"
import { activeJobs, deploymentQueueDuration, deploymentsCompleted, deploymentsFailed } from "@shipyard/metrics";

const upload_worker = new Worker(
    "deploymentQueue",
    uploader,
    {
        connection: redis_class.getQueueConnection(),
        maxStalledCount: 2,
        stalledInterval: 60 * 1000,
        lockDuration: 10 * 60 * 1000,
    }
)

upload_worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);

    activeJobs.dec();
    
    deploymentsCompleted.inc();
});

upload_worker.on(
    "stalled", (jobId) => {
        console.log(`${jobId} stalled`);
        // activeJobs.dec();
    });

upload_worker.on("error", (error) => {
    console.log("Error in a Job " + error);
    // activeJobs.dec();
    // deploymentsFailed.inc();
});

upload_worker.on("active", (job) => {
    console.log(`Job ${job.id} is active`);

    const queueTime = (Date.now() - job.timestamp) / 1000;
    deploymentQueueDuration.observe(queueTime);

    activeJobs.inc();
});

upload_worker.on("failed", (job, error) => {
    activeJobs.dec();

    deploymentsFailed.inc();

    console.log(error);
    console.log(`Job ${job?.id} failed`);
});