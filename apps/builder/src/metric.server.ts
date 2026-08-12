import http from "http";
import { register } from "@shipyard/metrics";


const server = http.createServer(async (req, res) => {
    if (req.url === "/metrics") {
        res.writeHead(200, { "Content-Type": register.contentType });
        res.end(await register.metrics());
        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});


server.listen(6969, () => {
    console.log("Metrics server running on port 6969");
});