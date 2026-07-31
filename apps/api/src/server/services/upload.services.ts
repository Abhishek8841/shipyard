import { prisma } from "@shipyard/database";
import { uploadType } from "../schema/upload.schema";
import { idType } from "../schema/auth.schema";
import { DeploymentStatus } from "../../../../../packages/database/dist/src/generated/prisma/enums";
import { queueFunctions } from "../../queue/manager.queue";

export const uploadService = async (deploymentDetails: uploadType, id: idType): Promise<string> => {

    const { url, projectName } = deploymentDetails;

    const newDeployment = await prisma.deployment.create({
        data: {
            userId: id,
            gitUrl: url,
            projectName,
            status: DeploymentStatus.QUEUED,
        }
    });

    try {
        await queueFunctions.addDeployment(newDeployment.id, newDeployment.projectName, newDeployment.gitUrl);
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