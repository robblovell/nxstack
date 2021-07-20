"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interceptor = void 0;
const tslib_1 = require("tslib");
const ngrok_1 = require("./tunnels/local/ngrok");
const nginx_1 = require("./proxies/nginx");
const session_1 = require("./session");
const process_1 = require("./tunnels/local/process");
class Interceptor extends session_1.CompositeService {
    toDescription() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return {
                display: `Intercepting ${this.params.remoteService} in ${this.params.namespace}`,
                cleanUpParams: {
                    namespace: this.params.namespace,
                    remoteService: this.params.remoteService,
                    remotePort: this.params.remotePort,
                    localPort: this.params.localPort,
                    header: this.params.header
                }
            };
        });
    }
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const action = this.params.clean ? 'Closing' : 'Starting';
            const msg = `${action} intercept session for ${this.params.remoteService} in ${this.params.namespace}`;
            yield this.wrapStatus(msg, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const ngrokProcess = new process_1.NgrokProcess(this.params);
                yield ngrokProcess.perform();
                this.registerForCleanup(ngrokProcess);
                this.params.localPort = this.params.localPort || this.params.remotePort;
                const tunnel = new ngrok_1.NgrokTunnel(this.params);
                yield tunnel.perform();
                this.registerForCleanup(tunnel);
                this.params.upstreamURL = this.params.localTunnelURL;
                const proxy = new nginx_1.NGINXServiceProxy(this.params);
                yield proxy.perform();
                this.registerForCleanup(proxy);
                if (!this.params.clean) {
                    (_a = this.params.status) === null || _a === void 0 ? void 0 : _a.push('Connecting remote service to local tunnel');
                    (_b = this.params.status) === null || _b === void 0 ? void 0 : _b.pop();
                }
            }));
        });
    }
}
exports.Interceptor = Interceptor;
//# sourceMappingURL=interceptor.js.map