import { Container, Exec } from "dockerode";
import docker from "./client.docker";
import { Writable } from "stream";
import path from "path";
import { redis_class } from "@shipyard/redis";
import { prisma } from "@shipyard/database";

const publisher = redis_class.getConnection();


export class DockerManager {
    static async createContainer(ENV: string[]) {
        console.log("inside manager.docker.ts -> createContainer");
        // const mountPath = path.join(__dirname, "main.sh");
        // console.log(mountPath);
        const container = await docker.createContainer(
            {
                Env: ENV,
                // Image: "shipyard-builder-image:latest",
                Image: "ghcr.io/abhishek8841/shipyard-builder-image:latest",
                // WorkingDir: "/app",
                Cmd: ["sleep", "infinity"],
                Tty: false,
                HostConfig: {
                    AutoRemove: false,
                    // Binds: [`${mountPath}:/builder/main.sh:ro`],
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

    static async collectOutput(exec: Exec, deploymentId: string) {
        const stream = await exec.start({});
        let stdout = "";
        let stderr = "";

        console.log("output collection started");

        const stdoutBox = new Writable({
            async write(chunk, encoding, callback) {
                const data = chunk.toString();
                await prisma.log.create({
                    data: {
                        deploymentId,
                        message: data,
                    }
                });
                console.log(data);
                stdout += data;
                publisher.publish(`deployment:${deploymentId}`, data);
                callback();
            },
        });

        const stderrBox = new Writable({
            async write(chunk, encoding, callback) {
                const data = chunk.toString();
                await prisma.log.create({
                    data: {
                        deploymentId,
                        message: data,
                    }
                });
                console.log(data);
                stdout += data;
                publisher.publish(`deployment:${deploymentId}`, data);
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

    static async startContainer(container: Container, gitUrl: string, deploymentId: string, directory: string) {
        console.log("starting exec");
        const exec = await container.exec({
            Cmd: ["/bin/bash", "/builder/main.sh", gitUrl, directory],
            AttachStderr: true,
            AttachStdout: true,
            Tty: false,
        });
        console.log("exec done", "+", "going to output collection now");

        return await this.collectOutput(exec, deploymentId);
    }

    static async getBuildArtifacts(container: Container, directory: string) {
        console.log(`/app/${directory}/dist`);
        const stream = await container.getArchive({
            path: `/app/${directory}/dist`,
        })
        // console.log("Stream archive returned by docker is ", stream);
        return stream;
    }

    static async destroyContainer(container: Container) {
        await container.stop().catch((error) => { console.log(error) });
        await container.remove({ force: true });
    }
}