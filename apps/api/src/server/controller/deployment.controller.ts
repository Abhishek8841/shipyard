
// get prev deployment
// get a deployments details
// get logs for a deployment

import { Request, Response } from "express";
import { idSchema } from "../schema/auth.schema";
import { getDeploymentDetailsService, getLogsService, getPrevDeploymentsService } from "../services/deployment.services";

export const getPrevDeployments = async (req: Request, res: Response) => {
    try {
        const idResult = idSchema.safeParse(req.id);
        if (!idResult.success) return res.status(400).json({
            success: false,
            message: "Invalid request",
        })
        const deployments = await getPrevDeploymentsService(idResult.data);
        return res.status(200).json({
            success: true,
            message: "Successfully fetched previous deployments",
            deployments
        })
    } catch (error) {
        console.log("error in getPrevDeployments function @24", error);
        return res.status(400).json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Error while fetching previous deployments"
            }
        )
    }
}

export const getDeploymentDetails = async (req: Request, res: Response) => {
    try {
        const idResult = idSchema.safeParse(req.id);
        const deploymentIdresult = idSchema.safeParse(req.params.id);
        if (!deploymentIdresult.success || !idResult.success) return res.status(400).json({
            success: false,
            message: "Invalid request",
        })
        const details = await getDeploymentDetailsService(idResult.data, deploymentIdresult.data);

        return res.status(200).json({
            success: true,
            message: "Successfully fetched deployment details",
            details
        })
    } catch (error) {
        console.log("error in getDeploymentDetails function @50", error);
        return res.status(400).json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Error while fetching details of this deployments"
            }
        )
    }
}

export const getLogs = async (req: Request, res: Response) => {
    try {
        const idResult = idSchema.safeParse(req.id);
        const deploymentIdresult = idSchema.safeParse(req.params.id);
        if (!deploymentIdresult.success || !idResult.success) return res.status(400).json({
            success: false,
            message: "Invalid request",
        })
        const details = (await getLogsService(idResult.data, deploymentIdresult.data)).logs;

        return res.status(200).json({
            success: true,
            message: "Successfully fetched previous deployments",
            details
        })
    } catch (error) {
        console.log("error in getLogs function @76", error);
        return res.status(400).json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Error while fetching logs"
            }
        )
    }
}

