import { prisma } from "@shipyard/database";
import { uploadType } from "../schema/upload.schema";
import { idType } from "../schema/auth.schema";
import { DeploymentStatus } from "../../../../../packages/database/dist/src/generated/prisma/enums";

export const uploadService = async (deploymentDetails: uploadType, id: idType): Promise<string> => {

    const { url, projectName } = deploymentDetails;

    const newDeployments = await prisma.deployment.create({
        data: {
            userId: id,
            gitUrl: url,
            projectName,
            status: DeploymentStatus.QUEUED,
        }
    });
    
    return newDeployments.id;
}