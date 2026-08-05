import { prisma } from "@shipyard/database";
import { idType } from "../schema/auth.schema";

export async function getPrevDeploymentsService(id: idType) {
    return await prisma.deployment.findMany({
        where: {
            userId: id
        },
        orderBy: {
            createdAt: "desc",
        }
    })
}

export async function getDeploymentDetailsService(id: idType, deploymentId: idType) {
    const deploymentDetails = await prisma.deployment.findFirst({
        where: {
            id: deploymentId,
            userId: id,
        }
    })
    if (!deploymentDetails) throw new Error("Invalid userId or deploymentId")
    return deploymentDetails;
}

export async function getLogsService(id: idType, deploymentId: idType) {
    const logDetails = await prisma.deployment.findFirst({
        where: {
            id: deploymentId,
            userId: id,
        },
        select: {
            logs: {
                select: {
                    id: true,
                    message: true,
                    deploymentId: true,
                    createdAt: true,
                },
                orderBy: {
                    createdAt: "asc",
                }
            }
        }
    })
    if (!logDetails) throw new Error("No log details available")
    return logDetails;
}