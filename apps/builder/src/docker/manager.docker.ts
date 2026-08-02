import { Container, Exec } from "dockerode";
import docker from "./client.docker";
import { Writable } from "stream";
import path from "path";


export class DockerManager {
    static async createContainer() {
        console.log("inside manager.docker.ts -> createContainer");
        const mountPath = path.join(__dirname, "main.sh");
        console.log(mountPath);
        const container = await docker.createContainer(
            {
                Image: "node:22",
                WorkingDir: "/app",
                Cmd: ["sleep", "infinity"],
                Tty: false,
                HostConfig: {
                    AutoRemove: false,
                    Binds: [`${mountPath}:/builder/main.sh:ro`],
                    // NetworkMode: "none",
                    // CapDrop: ["ALL"],
                    NanoCpus: 1_000_000_000,
                    Memory: 256 * 1024 * 1024,
                },

                // User: "nobody",
            }
        )
        await container.start();
        console.log("container started");
        return container;
    }

    static async collectOutput(exec: Exec) {
        const stream = await exec.start({});
        let stdout = "";
        let stderr = "";

        console.log("output collection started");

        const stdoutBox = new Writable({
            write(chunk, encoding, callback) {
                stdout += chunk;
                callback();
            },
        });

        const stderrBox = new Writable({
            write(chunk, encoding, callback) {
                stderr += chunk;
                callback();
            }
        });

        docker.modem.demuxStream(
            stream,
            stdoutBox,
            stderrBox
        );

        await new Promise((res, rej) => {
            stream.on("end", res);
            stream.on("error", rej);
        });

        const inspect = await exec.inspect();
        console.log("output collection done");
        return {
            exitCode: inspect.ExitCode,
            stdout,
            stderr,
        };
    }

    static async startContainer(container: Container, gitUrl: string) {
        console.log("starting exec");
        const exec = await container.exec({
            Cmd: ["/bin/bash", "/builder/main.sh", gitUrl],
            AttachStderr: true,
            AttachStdout: true,
            Tty: false,
        });
        console.log("exec done", "+", "going to output collection now");

        return await this.collectOutput(exec);
    }

    static async streamLogs() {

    }

    static async getBuildArtifacts(container: Container) {
        const stream = await container.getArchive({
            path: "/app/dist",
        })
        // console.log("Stream archive returned by docker is ", stream);
        return stream;
    }

    static async destroyContainer(container: Container) {
        await container.stop().catch(() => { });
        await container.remove({ force: true });
    }
}