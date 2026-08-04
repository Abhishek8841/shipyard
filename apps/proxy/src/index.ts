import dotenv from "dotenv";
dotenv.config();

import Express, { request, Request, Response } from "express";
import serveFiles from "./services/files.service";
import { getDeploymentId } from "./services/lookup.service";


const app = Express();


function isAsset(path: string): boolean {
    return (/\.[^/]+$/.test(path) && !path.endsWith(".html"));
}

app.get("/{*splat}", async (req: Request, res: Response) => {

    const hostname = req.hostname;
    const deploymentId: string = await getDeploymentId(hostname.split(".")[0] || "");

    let filePath = req.path;
    if (filePath == "/") filePath = "/index.html";

    console.log(hostname, filePath);

    try {

        await serveFiles(deploymentId, res, filePath);

    } catch (err) {

        if (isAsset(filePath)) {
            console.log("Asset doesn't exist");
            return res.status(404).json({
                success: false,
                message: "Asset doesn't exist"
            })
        }


        if ((err as any).Code == 'NoSuchKey') {
            try {
                return await serveFiles(deploymentId, res, "/index.html");
            }
            catch (error) {
                console.log("Could not serve index.html", error);

                return res.status(500).json({
                    success: false,
                    message: "Deployment not found"
                });
            }
        }

        console.log(err);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
});

app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err);

    if (res.headersSent) return res.destroy(err);

    return res.status(500).json({
        success: false,
        message: err instanceof Error ? err.message : "Internal Server Error... Caught in global error middleware @index.ts"
    });

});


app.listen(3001, () => { console.log("proxy server is live") });




// app.get("/index.html", (req, res) => {
//     fs.createReadStream("index.html").pipe(res);
// });
// **remember this pattern**