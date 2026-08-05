import app from "./server";
import { initWebsocketServer } from "./ws/ws";


async function startServer() {
    const server = app.listen(3000, async () => {
        await initWebsocketServer(server);
        console.log("server is live");
    });
}

startServer();