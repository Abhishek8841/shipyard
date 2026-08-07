import { DockerManager } from "../docker/manager.docker";
import { uploadToObjectStore } from "./uploader.helper";


type executorReturnType =
    {
        success: boolean,
        message: string
    };

export async function executor(gitUrl: string, deploymentId: string, directory: string): Promise<executorReturnType> {
    const container = await DockerManager.createContainer();
    try {
        const result = await DockerManager.startContainer(container, gitUrl, deploymentId, directory);

        if (result.exitCode != 0) throw new Error(result.stderr || "Build Failed");

        const stream = await DockerManager.getBuildArtifacts(container, directory);

        await uploadToObjectStore(deploymentId, stream);

        return {
            success: true,
            message: `Successfully Uploaded the build ${deploymentId}.tar to Object Store`,
        }
    }
    finally {
        console.log("destroying container");
        await DockerManager.destroyContainer(container);
        console.log("destroyed container");
    }
}