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


async function streamToBuffer(stream: Readable) {
    const chunks = [];

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
}


export async function uploadToObjectStore(
    deploymentId: string,
    stream: any
) {
    const buffer = await streamToBuffer(stream);

    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.MINIO_BUCKET!,
            Key: `${deploymentId}.tar`,
            Body: buffer,
            ContentType: "application/x-tar",
            ContentLength: buffer.length,
        })
    );

    console.log("Uploaded successfully");
}