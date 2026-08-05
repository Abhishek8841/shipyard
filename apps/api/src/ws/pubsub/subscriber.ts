import { redis_class } from "@shipyard/redis";
import { wsInstance } from "../ws.manager";


const subscriber = redis_class.getConnection().duplicate();
let started = false;

export async function startLogSubscriber() {
    if (started) return;
    await subscriber.psubscribe("deployment:*");

    started = true;

    subscriber.on("pmessage", (pattern, channel, message) => {
        console.log(pattern);
        console.log(channel);
        console.log(message);

        const deploymentId = channel.split(":")[1];

        if (!deploymentId) return;

        const sendToUserMessage = {
            deploymentId,
            log: message
        }
        wsInstance.sendToUser(deploymentId, sendToUserMessage);
    }
    );
}