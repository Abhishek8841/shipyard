import { redis_class } from "@shipyard/redis"
import { Worker } from "bullmq"
import { uploader } from "./processor/uploader.processor";


const upload_worker = new Worker(
    "deploymentQueue",
    uploader,
    {
        connection: redis_class.getQueueConnection(),
        maxStalledCount: 2,
        stalledInterval: 30000,
    }
)

upload_worker.on("completed", (job) => { console.log(`Job ${job.id} completed`); });

upload_worker.on("stalled", (jobId) => { console.log(`${jobId} stalled`); });

upload_worker.on("error", (error) => { console.log(error + " Error in a Job"); });

upload_worker.on("active", (job) => { console.log(`Job ${job.id} is active`); });

upload_worker.on("failed", (job, error) => {
    console.log(error);
    console.log(`Job ${job?.id} failed`);
});