"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const logger_1 = require("@c6o/logger");
const client_1 = require("@c6o/kubeclient/client");
const workload_1 = require("./workload");
const debug = logger_1.createDebug();
let monitor;
const main = (params) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const cluster = new client_1.Cluster(params);
        params.cluster = cluster;
        monitor = new workload_1.WorkloadEnvMonitor(params);
        yield monitor.start();
    }
    catch (ex) {
        debug('ERROR', ex);
    }
});
process.on('message', main);
process.on('SIGTERM', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    debug('monitor disconnecting');
    yield (monitor === null || monitor === void 0 ? void 0 : monitor.stop());
    debug('monitor disconnected');
    process.exit(0);
}));
//# sourceMappingURL=child.js.map