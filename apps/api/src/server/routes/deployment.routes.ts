import Express from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { getDeploymentDetails, getLogs, getPrevDeployments } from "../controller/deployment.controller";
const deploymentRouter = Express.Router();

deploymentRouter.get("/deployments", authMiddleWare, getPrevDeployments);
deploymentRouter.get("/deployment/:id", authMiddleWare, getDeploymentDetails);
deploymentRouter.get("/deployment/logs/:id", authMiddleWare, getLogs);

export default deploymentRouter;