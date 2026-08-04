import { prisma } from "@shipyard/database"


export const getDeploymentId = async (projectName: string): Promise<string> => {
    if(projectName == "localhost") throw new Error("Pls provide a project name in the url")
    const deployment = await prisma.deployment.findFirst({
        where: { projectName }
    })
    if (!deployment) throw new Error("No such deployment exists");
    return deployment.id;
}