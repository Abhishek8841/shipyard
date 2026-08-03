import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import Express, { Request, Response } from "express";
import { Readable, Writable } from "stream";
import dotenv from "dotenv";

dotenv.config();

const app = Express();

const s3 = new S3Client({
    endpoint: process.env.MINIO_ENDPOINT!,
    region: "auto",
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY!,
        secretAccessKey: process.env.MINIO_SECRET_KEY!,
    },
    forcePathStyle: true,
})


function objectStream(deploymentId: string, path: string) {
    return new GetObjectCommand({
        Bucket: process.env.MINIO_BUCKET!,
        Key: `${deploymentId}${path}`,
    });
}
app.get("/*splat", async (req: Request, res: Response) => {
    const hostname = req.hostname;
    const deploymentId = hostname.split(".")[0] || "";
    const filePath = req.path;
    console.log(hostname, filePath);
    try {
        const result = await s3.send(
            objectStream(deploymentId, filePath)
        );
        if(result.ContentType){
            res.setHeader("Content-Type", result.ContentType);
        }
        if (result.Body instanceof Readable) {
            result.Body.pipe(res);
        }
        else {
            res.status(500).send("Invalid stream");
        }
    } catch (err) {
        console.log(err);
        res.status(404).send("Not Found");
    }
});

app.listen(3001, () => { console.log("proxy server is live") });