import { builderRegister } from "@shipyard/metrics";
import http from "http";


const server = http.createServer(async (req, res) => {
    if (req.url === "/metrics") {
        res.writeHead(200, { "Content-Type": builderRegister.contentType });
        res.end(await builderRegister.metrics());
        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});


server.listen(3030, () => {
    console.log("Metric server of builder is running on port 3030");
});