import { Queue } from "bullmq";
import { redis_class } from "@shipyard/redis";

export const deploymentQueue = new Queue(
    "deploymentQueue",
    { connection: redis_class.getQueueConnection() }
)