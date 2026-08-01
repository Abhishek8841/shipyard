import { Job } from "bullmq";
import { jobArgs } from "@shipyard/shared"
import { prisma } from "@shipyard/database";
import { DeploymentStatus } from "@shipyard/database/status"

export async function uploader(job: Job<jobArgs>) {
    const { deploymentId, projectName, gitUrl } = job.data;
    console.log(`job received with following params:-> ${job.data}`)

    await prisma.deployment.update({
        where: { id: deploymentId },
        data: {
            status: DeploymentStatus.BUILDING,
        }
    });
    

}