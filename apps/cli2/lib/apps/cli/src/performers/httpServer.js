"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPServer = void 0;
const tslib_1 = require("tslib");
const http_1 = require("http");
const stoppable_1 = tslib_1.__importDefault(require("stoppable"));
class HTTPServer {
    respond(res, status, response) {
        res.writeHead(status, { 'Content-Type': 'text/plain' });
        res.statusCode = status;
        res.end(response);
    }
    start(port, requestListener) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.server)
                return;
            this.server = stoppable_1.default(http_1.createServer(requestListener)).listen(port);
            return this.serverPromise = new Promise(resolve => this.callback = resolve);
        });
    }
    stop() {
        this.server.close();
        this.callback();
    }
}
exports.HTTPServer = HTTPServer;
//# sourceMappingURL=httpServer.js.map