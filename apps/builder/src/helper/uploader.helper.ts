import { S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "stream"
import tar from "tar-stream"
import mime from "mime"


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
    requestChecksumCalculation: "WHEN_REQUIRED"
})


async function extractTar(
    deploymentId: string,
    mainStream: Readable
) {

    const extract = tar.extract();

    extract.on(
        "entry",
        async (header, stream, next) => {

            if (header.type === "directory") {
                stream.resume();
                next();
                return;
            }

            const filePath =
                header.name.replace(/^dist\//, "");

            const fileType = mime.getType(filePath);

            try {

                const upload = new Upload({
                    client: s3,
                    params: {
                        Bucket: process.env.MINIO_BUCKET!,
                        Key: `${deploymentId}/${filePath}`,
                        Body: Readable.from(stream),
                        ContentType: fileType ?? "application/octet-stream",
                    },
                });

                await upload.done();
                next();

            } catch (error: any) {

                extract.destroy(error);

            }
        }
    );

    mainStream.pipe(extract);

    await new Promise((resolve, reject) => {
        extract.on("finish", resolve);
        extract.on("error", reject);
    });
}

// async function streamToBuffer(stream: Readable) {
//     // stream.pipe(x);
//     const chunks = [];

//     for await (const chunk of stream) {
//         chunks.push(Buffer.from(chunk));
//     }

//     return Buffer.concat(chunks);
// }

export async function uploadToObjectStore(
    deploymentId: string,
    stream: any
) {
    await extractTar(
        deploymentId,
        stream
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