import { WebSocket } from "ws";
import { sendLogSchema, sendLogType } from "./schema/server.schema";


export class websocketManager {
    private userList: Map<string, Set<WebSocket>> = new Map();

    private constructor() { }

    private static instance: websocketManager

    static getInstance() {
        if (!websocketManager.instance) websocketManager.instance = new websocketManager();
        return websocketManager.instance;
    }

    getUserConnections(id: string) {
        return this.userList.get(id);
    }

    addUserConnections(id: string, ws: WebSocket) {
        if (!this.userList.has(id)) this.userList.set(id, new Set<WebSocket>());
        this.userList.get(id)?.add(ws);
    }

    removeUser(id: string, ws: WebSocket) {
        const list = this.getUserConnections(id);
        list?.delete(ws);
        if (list?.size == 0) this.userList.delete(id);
    }

    sendToUser(id: string, message: sendLogType) {
        const result = sendLogSchema.safeParse(message);
        if (!result.success) return;
        const socketList = this.getUserConnections(id);
        if (!socketList) return;
        for (const socket of socketList) {
            if (socket.readyState != WebSocket.OPEN) {
                console.log(`Failed to send to user ${id}`);
                socket.terminate();
                this.removeUser(id, socket);
                continue;
            }
            try {
                socket.send(JSON.stringify(result.data));
            }
            catch (error) {
                console.log(`Failed to send to user ${id}`);
                socket.terminate();
                this.removeUser(id, socket);
            }
        }
    }

}

export const wsInstance = websocketManager.getInstance();