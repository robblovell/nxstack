"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NgrokTunnel = void 0;
const tslib_1 = require("tslib");
const logger_1 = require("@c6o/logger");
const session_1 = require("../../session");
const client_1 = require("./client");
const debug = logger_1.createDebug();
class NgrokTunnel extends session_1.SessionService {
    get signature() { return `local-tunnel-${this.params.localPort}`; }
    sessionInProgress() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.session.any(NgrokTunnel.cleanUpKeys);
        });
    }
    executeCleanup() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = yield client_1.getClient();
            if (client) {
                const port = yield this.session.get('local-port');
                if (port)
                    yield client.deleteTunnel(port);
            }
            return true;
        });
    }
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = yield client_1.getClient();
            const params = {
                addr: this.params.localPort,
                proto: 'http',
                bind_tls: false,
                name: this.params.localPort.toString()
            };
            const result = yield client.createTunnel(params);
            yield this.session.set('local-port', this.params.localPort);
            this.params.localTunnelURL = result.public_url;
        });
    }
}
exports.NgrokTunnel = NgrokTunnel;
NgrokTunnel.cleanUpKeys = ['local-port'];
//# sourceMappingURL=ngrok.js.map