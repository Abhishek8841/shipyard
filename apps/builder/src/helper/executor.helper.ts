import { DockerManager } from "../docker/manager.docker";
import { uploadToObjectStore } from "./uploader.helper";


type executorReturnType =
    {
        success: boolean,
        message: string
    };

export async function executor(gitUrl: string, deploymentId: string): Promise<executorReturnType> {
    const container = await DockerManager.createContainer();
    try {
        const result = await DockerManager.startContainer(container, gitUrl);

        if (result.exitCode != 0) throw new Error(result.stderr || "Build Failed");

        const dotTarFile = await DockerManager.getBuildArtifacts(container);

        await uploadToObjectStore(deploymentId, dotTarFile);

        return {
            success: true,
            message: `Successfully Uploaded the build ${deploymentId}.tar to Object Store`,
        }
    }
    finally {
        await DockerManager.destroyContainer(container);
    }
}