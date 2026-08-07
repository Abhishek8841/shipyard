import { deploymentQueue } from "./upload.queue";

class QueueManager {
    addDeployment(deploymentId: string, projectName: string, gitUrl: string, directory: string) {
        return deploymentQueue.add(
            "upload",
            {
                deploymentId,
                projectName,
                gitUrl,
                directory
            },
            {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 3000,
                },
                removeOnFail: 100,
                removeOnComplete: 100,
            }
        )
    }
}

export const queueFunctions = new QueueManager();