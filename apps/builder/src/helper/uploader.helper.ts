import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Readable } from "stream"

export const s3 = new S3Client({
    endpoint: process.env.MINIO_ENDPOINT!,
    region: "auto",
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY!,
        secretAccessKey: process.env.MINIO_SECRET_KEY!,
    },
    forcePathStyle: true,
})


export async function uploadToObjectStore(deploymentId: string, dotTarFile: Readable) {
    await s3.send(new PutObjectCommand(
        {
            Bucket: process.env.MINIO_BUCKET!,
            Key: `${deploymentId}.tar`,
            Body: dotTarFile,
            ContentType: "application/x-tar",
        }
    ));
    console.log("Inside uploader.helper.ts");
}