import { Job } from "bullmq";
import { jobArgs } from "@shipyard/shared"
import { prisma } from "@shipyard/database";
import { DeploymentStatus } from "@shipyard/database/status"
import { executor } from "../helper/executor.helper";

export async function uploader(job: Job<jobArgs>) {
    try {
        const { deploymentId, projectName, gitUrl } = job.data;
        console.log("job received with following params:-> ", job.data)

        await prisma.deployment.update({
            where: { id: deploymentId },
            data: {
                status: DeploymentStatus.BUILDING,
            }
        });

        await executor(gitUrl, deploymentId);

        await prisma.deployment.update({
            where: { id: deploymentId },
            data: {
                status: DeploymentStatus.READY,
            }
        });

        return {
            name: projectName,
            success: true,
            message: `Deployment ID ${deploymentId} successfull`,
        }

    } catch (error: unknown) {
        console.log(error instanceof Error ? error.message : "Internal Server Error");
        await prisma.deployment.update({
            where: { id: job.data.deploymentId },
            data: {
                status: DeploymentStatus.FAILED,
            }
        });
        throw error;
    }
}