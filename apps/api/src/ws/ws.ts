import { IncomingMessage, Server } from "node:http";
import { WebSocket, WebSocketServer } from "ws";
import { getUserId } from "./utils/userId.util";
import { wsInstance } from "./ws.manager";



export function initWebsocketServer(server: Server) {
    const wss = new WebSocketServer({ server });


    wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
        const id = getUserId(req);
        if (!id) {
            ws.close();
            return;
            // remember to return the callbacks**
        }

        wsInstance.addUserConnections(id, ws);

        console.log(`Connected -> ${id}`);

        ws.on("message", (msg) => {

        })

        ws.on("error", (error) => {
            console.log(error);
            ws.close();
            return;
        })

        ws.on("close", () => {
            wsInstance.removeUser(id, ws);
            console.log(`connection closed -> ${id}`);
        })

    })
}