import app from "./server";
import { initWebsocketServer } from "./ws/ws";


async function startServer() {
    const server = app.listen(3010, async () => {
        await initWebsocketServer(server);
        console.log("Api server is live on port 3010");
    });
}

startServer();