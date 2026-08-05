import { IncomingMessage, Server } from "node:http";
import { WebSocket, WebSocketServer } from "ws";
import { getUserId } from "./utils/userId.util";
import { wsInstance } from "./ws.manager";
import { prisma } from "@shipyard/database";
import { startLogSubscriber } from "./pubsub/subscriber";


export async function initWebsocketServer(server: Server) {
    const wss = new WebSocketServer({ server });
    await startLogSubscriber();

    wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
        const id = getUserId(req);
        if (!id) {
            ws.close();
            return;
            // remember to return the callbacks**
        }

        const url = new URL(req.url!, "http://localhost:3000");
        const deploymentId = url.pathname.split("/")[1];
        if (!deploymentId) {
            ws.close();
            return;
        }
        let deployment = undefined;
        try {
            deployment = await prisma.deployment.findFirst({
                where: {
                    id: deploymentId,
                    userId: id
                }
            })
        }
        catch (error) {
            console.log(error + "Error in WS server @37 [probable cause - DB]")
        }
        if (!deployment) {
            ws.close();
            return;
        }

        wsInstance.addUserConnections(deploymentId, ws);

        console.log(`Connected to deployment ID -> ${deploymentId}`);

        ws.on("message", (msg) => {
            console.log(msg.toString());
        })

        ws.on("error", (error) => {
            console.log(error);
            ws.close();
            return;
        })

        ws.on("close", () => {
            wsInstance.removeUser(deploymentId, ws);
            console.log(`connection closed deploymentId-> ${deploymentId}`);
        })

    })
}