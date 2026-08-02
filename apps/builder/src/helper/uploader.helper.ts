import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Readable } from "stream"
import tar from "tar-stream"


// import fs from "fs";
// const x = fs.createWriteStream("./temp.txt");


export const s3 = new S3Client({
    endpoint: process.env.MINIO_ENDPOINT!,
    region: "auto",
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY!,
        secretAccessKey: process.env.MINIO_SECRET_KEY!,
    },
    forcePathStyle: true,
})


async function extractTar(deploymentId: string, buffer: Buffer) {

    const extract = tar.extract();

    extract.on("entry", (header, stream, next) => {

        const chunks: Buffer[] = [];

        stream.on(
            "data",
            chunk => {
                chunks.push(Buffer.from(chunk));
            }
        );

        stream.on("end", async () => {

            const fileBuffer =
                Buffer.concat(chunks);
            const newHeader = header.name.replace(/^dist\//,"")
            await s3.send(
                new PutObjectCommand({
                    Bucket: process.env.MINIO_BUCKET!,
                    Key: `${deploymentId}/${newHeader}`,
                    Body: fileBuffer
                })
            );

            next();
        }
        );

        stream.resume();
    }
    );


    Readable.from(buffer)
        .pipe(extract);

    await new Promise(resolve => {
        extract.on("finish", resolve);
    });
}

async function streamToBuffer(stream: Readable) {
    // stream.pipe(x);
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
    await extractTar(
        deploymentId,
        buffer
    );

    // await s3.send(
    //     new PutObjectCommand({
    //         Bucket: process.env.MINIO_BUCKET!,
    //         Key: `${deploymentId}.tar`,
    //         Body: buffer,
    //         ContentType: "application/x-tar",
    //         ContentLength: buffer.length,
    //     })
    // );

    console.log("Uploaded successfully");
}