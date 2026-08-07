import { Request, Response } from "express";
import { idSchema } from "../schema/auth.schema";
import { uploadService } from "../services/upload.services";
import { uploadSchema } from "../schema/upload.schema";

export const uploadToQueue = async (req: Request, res: Response) => {
    try {
        const result = uploadSchema.safeParse(req.body);
        const idResult = idSchema.safeParse(req.id);
        if (!result.success || !idResult.success) return res.status(400).json({
            success: false,
            message: "Wrong inputs"
        });

        const deploymentDetails = result.data;
        const id = idResult.data;

        const DeploymentId = await uploadService(deploymentDetails, id);

        return res.status(200).json({
            success: true,
            message: "successfully started the deployments",
            deploymentDetails: {
                url: deploymentDetails.url,
                projectName: deploymentDetails.projectName,
                id: DeploymentId,
                directory: deploymentDetails.directory ? deploymentDetails.directory : ".",
            }
        })
    }
    catch (error) {
        console.log(error);
        res.status(400).json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error"
            }
        )
    }
}