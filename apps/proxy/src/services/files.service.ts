import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../client/s3.client";
import { Response } from "express";

async function serveFiles(deploymentId: string, res: Response, filePath: string) {
    
    const result = await s3.send(
        new GetObjectCommand({
            Bucket: process.env.MINIO_BUCKET!,
            Key: `${deploymentId}${filePath}`,
        })
    );

    // this await goes to catch only when the aws storage fails and then promise resolves
    // the stream has its own life cycle
    // therefore, we have to do stream.on("error",()=>{})
    if (!result.Body) {
        throw new Error("Empty body");
    }

    const stream = result.Body as NodeJS.ReadableStream;

    if (result.ContentType) {
        res.setHeader(
            "Content-Type",
            result.ContentType
        );
    }

    if (result.ContentLength) {
        res.setHeader(
            "Content-Length",
            result.ContentLength
        );
    }

    if (result.ETag) {
        res.setHeader(
            "ETag",
            result.ETag
        );
    }


    if (filePath.endsWith(".html")) {
        res.setHeader(
            "Cache-Control",
            "no-cache"
        );
    }
    else {
        res.setHeader(
            "Cache-Control",
            "public, max-age=31536000, immutable"
        );
    }

    stream.on("error", (error) => {
        console.log(error);
        if (res.headersSent) {
            res.destroy(error);
        }
        else {
            res.status(500).send("Stream error");
        }
    });

    stream.pipe(res);
}

export default serveFiles;