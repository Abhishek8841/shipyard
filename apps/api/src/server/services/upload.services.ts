import { prisma } from "@shipyard/database";
import { uploadType } from "../schema/upload.schema";
import { idType } from "../schema/auth.schema";
import { DeploymentStatus } from "@shipyard/database/status";
import { queueFunctions } from "../../queue/manager.queue";

export const uploadService = async (deploymentDetails: uploadType, id: idType): Promise<string> => {

    const { url, projectName } = deploymentDetails;

    const found = await prisma.deployment.findFirst({
        where: { projectName },
    });

    if (found) throw new Error("Project name already in use");

    const directory = deploymentDetails.directory ? deploymentDetails.directory : ".";

    const newDeployment = await prisma.deployment.create({
        data: {
            userId: id,
            directory,
            gitUrl: url,
            projectName,
            status: DeploymentStatus.QUEUED,
        }
    });

    try {
        await queueFunctions.addDeployment(newDeployment.id, newDeployment.projectName, newDeployment.gitUrl, directory);
    } catch (error) {
        await prisma.deployment.update({
            where: { id: newDeployment.id },
            data: { status: DeploymentStatus.FAILED }
        })
        throw error;
    }

    // read about OUTBOX pattern

    return newDeployment.id;
}